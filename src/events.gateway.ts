import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit
  } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

import {docItemService} from './doc/doc_info.service'
import { docItem } from './doc/doc_info.entity';
import {conversationItemService} from './conversation/conversation_info.service'
import { conversationItem } from './conversation/conversation_info.entity';
import {openaiVectordbService} from './openai_vectordb/openai_vectordb.service'
import { openaiVectordbItem } from './openai_vectordb/openai_vectordb.entity';
import { jwtMiddleware } from './jwt.middleware';

import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";

import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold";

function findTextInString(A, B) {
    let bIndexInA = A.indexOf(B);
    let fileIndexEnd = A.lastIndexOf(' ', bIndexInA + B.length); // Finding the end index of 'FILENAME xxx'
    let filenameIndex = A.lastIndexOf('FILENAME:', fileIndexEnd);
    let pageEnd = A.indexOf(' ', A.lastIndexOf('PAGENUM:', bIndexInA + B.length));
    let pageNumberIndex = A.lastIndexOf('PAGENUM:', pageEnd);
    
    if(filenameIndex === -1 || pageNumberIndex === -1) {
        return null;
    }
    
    return {
        textB: B,
        filename: A.substring(filenameIndex + 'FILENAME:'.length, fileIndexEnd),
        pageNumber: A.substring(pageNumberIndex + 'PAGENUM:'.length, pageEnd),
    }
}

function findMark(A){
    let markIndex = A.indexOf('[*]');

    if(markIndex === -1){
        return null; // Return null if there's no mark present
    }

    return A.substring(0, markIndex);
}

function isArrayNotEmpty(arr) {
    // Check if arr is an array and if it's not empty
    return Array.isArray(arr) && arr.length !== 0;
}

@WebSocketGateway({namespace: '/ws',
cors: {
origin: '*', // 允许所有来源
methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // 允许的方法
allowedHeaders: ["my-custom-header"], // 可选的头部
credentials: true // 需要证书
} })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect,OnGatewayInit {
    constructor(private readonly docItemService: docItemService,
                private readonly conversationItemService: conversationItemService,
                private readonly openaiVectordbService: openaiVectordbService,) {} 
    @WebSocketServer()
    server: Server;

    // jwt
    afterInit(server: Server) {
        this.server.use(jwtMiddleware);
      }
    //----

    private clients = new Map<string, any>();
    private openAIApiKey = process.env.REACT_APP_openAIApiKey;
    private textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1500,
        chunkOverlap: 0,
    });

handleConnection(client: any, ...args: any[]) {
    console.log('Client connected:', client.id);
    let sequenceID =0;
    this.clients.set(client.id, {
        sequenceID: sequenceID,
        sessionID: uuidv4(),
        conversationID: uuidv4(),
        finalText: '',
        model:null,
        docs:[],
        embeddings:null,
        splitDocs:null,
        vectorStore:null,
        memory:null,
        chain:null,
        user: client.decoded,
    })

}

handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
    // 删除会话
    this.clients.delete(client.id);
    // 关闭会话，将数据库中该conversationId对应的项变为expired

}

@SubscribeMessage('getSession')
handleGetSession(client: any, payload: any): string {
    console.log('message received', payload)
    const clientState = this.clients.get(client.id);
    client.emit('IDs', { sessionID: clientState.sessionID, 
                        conversationID: clientState.conversationID ,
                        seqenceID:clientState.seqenceID});
    return 'Get Session from Server';
}

@SubscribeMessage('testmessage')
handleMessage(client: any, payload: any): string {
    console.log('message received', payload)
    return 'Hello world!';
}

@SubscribeMessage('findFile')
async handleFindFile(client: any, payload: any){
    console.log('findFile', payload)
    console.log(payload)
    const fileExists = await this.docItemService.existDocs(payload);
    // client.emit('fileExists', {fileExists:fileExists});
    let isFileExists = (fileExists!==null)
    
    return isFileExists;
}


@SubscribeMessage('onUpload')
async handleOnUpload(client: any, payload: any) {
    console.log('message received')
    let clientState = this.clients.get(client.id);
    clientState.docs=[];
    // 获取所有文本
    let fileTexts = payload.map(content => content.fileText);

    // 使用join方法将所有的fileText合并为一个字符串
    clientState.finalText = fileTexts.join('');
    // 构建对话模型
    clientState.model = new ChatOpenAI({ modelName: "gpt-4" ,openAIApiKey:this.openAIApiKey});
    clientState.embeddings = new OpenAIEmbeddings({openAIApiKey:this.openAIApiKey});

    clientState.splitDocs = await this.textSplitter.splitDocuments([
        new Document({ pageContent: clientState.finalText }),
      ])

    //memoryvectors
    const newDocItems: docItem[] = [];
    //上传azure postgres doc-info数据库
    let splitDocLists = []
    const newVectorItems: openaiVectordbItem[] = [];
    // Iterate over the payload (each item should be a FileContent object)
    
    const checkDocs = async () => {
    for (const fileContent of payload) {
        const docItemInstance = new docItem();

        // Map FileContent properties to docItem properties
        // The properties should be replaced by your actual docItem entity properties
        docItemInstance.doc_name = fileContent.fileName;
        docItemInstance.doc_url = fileContent.fileUrl;
        docItemInstance.doc_type = fileContent.fileType;
        docItemInstance.doc_sha256 = fileContent.fileSha256;
        clientState.docs.push(fileContent.fileSha256)
        
        // 文件vectordb
        let splitDoc = await this.textSplitter.splitDocuments([
            new Document({ pageContent: fileContent.fileText }),
          ])
        
        splitDocLists.push(splitDoc)

        // 检查是否已存在文件
        const fileExists = await this.docItemService.existDocs(fileContent.fileSha256);

        if (fileExists) {console.log(`Document found: ${JSON.stringify(fileExists)}`);continue;}
        //
        // save the embeddings
        // embeddings 写入后台数据库，由于typeorm对vector类型不支持，此处使用sql语句插入
        let vectorStores = await MemoryVectorStore.fromDocuments(splitDoc, clientState.embeddings);
        
        for (const vector of vectorStores.memoryVectors){
            const vectorItemInstance = new openaiVectordbItem();
            vectorItemInstance.doc_id = fileContent.fileSha256;
            vectorItemInstance.model = clientState.embeddings.modelName||'null'
            vectorItemInstance.doc_string = vector.content
            
            vectorItemInstance.vector = vector.embedding
            vectorItemInstance.loc = vector.metadata
            newVectorItems.push(vectorItemInstance);
        }
        docItemInstance.doc_available = true;
        docItemInstance.user_belonged = 'testman';
        // Add docItem to the array
        // console.log(docItemInstance)
        newDocItems.push(docItemInstance);
        
    }}
    
    await checkDocs().catch(console.error);

    // Save the docItems to the database
    if (isArrayNotEmpty(newDocItems)){const savedDocItems = await this.docItemService.insertDocs(newDocItems);}
    if (isArrayNotEmpty(newDocItems)){const savedVectorItems = await this.openaiVectordbService.insertVectors(newVectorItems);}
    //set the chain 
    clientState.splitDocs = splitDocLists.flat();
    // console.log(this.splitDocs)
    // this.vectorStore = await MemoryVectorStore.fromDocuments(this.splitDocs, this.embeddings);
    
    clientState.vectorStore = await MemoryVectorStore.fromDocuments(clientState.splitDocs, clientState.embeddings);
    const memory = new BufferMemory({
        memoryKey: "chat_history",
        returnMessages: true,
        });

    clientState.chain = ConversationalRetrievalQAChain.fromLLM(
            clientState.model,
            clientState.vectorStore.asRetriever(),
          {
            memory,
          }
        );
    // console.log(this.chain)
    this.clients.set(client.id, clientState);
}


@SubscribeMessage('onConversation')
async handleOnConversation(client: any, payload: any) {
    console.log('message received', payload)
    let clientState = this.clients.get(client.id);
    // run the chain
    let result = await clientState.chain.call({
    question: payload.message,
    });
    
    // client.emit('answer', { result });
    // const resultOne = await this.vectorStore.similaritySearch(result.text, 1);
    const retriever = ScoreThresholdRetriever.fromVectorStore(clientState.vectorStore, {
        minSimilarityScore: 0.6, // Finds results with at least this similarity score
        maxK: 3, // The maximum K value to use. Use it based to your chunk size to make sure you don't run out of tokens
        kIncrement: 1, // How much to increase K by each time. It'll fetch N results, then N + kIncrement, then N + kIncrement * 2, etc.
      });
    // get relevent docs in vectorstore
    const r_1 = await retriever.getRelevantDocuments(
        result.text
      );
    let ref = []
    // console.log(resultOne[0].pageContent)
    for(let _r_1 of r_1){
        let k = findTextInString(clientState.finalText,_r_1.pageContent);
        ref.push({refFilename:findMark(k.filename),
            refPage:findMark(k.pageNumber),
            refText:_r_1.pageContent
        })
    }
    
    // let r = findTextInString(this.finalText,resultOne[0].pageContent);
    client.emit('answer', {result: result, ref:ref});
    //save the conversation
    const newconversationItems: conversationItem[] = [];
    const conversationItemInstance = new conversationItem();
    conversationItemInstance.conversation_id = clientState.conversationID;
    conversationItemInstance.seq_id = payload.seq_id;
    clientState.seqenceID = payload.seq_id;
    conversationItemInstance.user_connected = 'testman';
    conversationItemInstance.doc_connected = clientState.docs;
    conversationItemInstance.quiz = payload;
    conversationItemInstance.answer = result;
    conversationItemInstance.expired = false
    newconversationItems.push(conversationItemInstance);

    this.clients.set(client.id, clientState);
    const savedDocItems = await this.conversationItemService.insertDocs(newconversationItems);
    return 'Hello world!';
}
}
