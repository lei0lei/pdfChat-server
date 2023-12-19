import {
        SubscribeMessage,
        WebSocketGateway,
        WebSocketServer,
        OnGatewayConnection,
        OnGatewayDisconnect
      } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

import {docItemService} from './doc_info.service'
import { docItem } from './doc_info.entity';
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";

import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
  // const splitDocs = await textSplitter.splitDocuments([
    //       new Document({ pageContent: body.docs }),
    //     ])

    // const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
    // const memory = new BufferMemory({
    //   memoryKey: "chat_history",
    //   returnMessages: true,
    // });

    // const chain = ConversationalRetrievalQAChain.fromLLM(
    //   model,
    //   vectorStore.asRetriever(),
    //   {
    //     memory,
    //   }
    // );

@WebSocketGateway({namespace: '/ws',
cors: {
    origin: '*', // 允许所有来源
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // 允许的方法
    allowedHeaders: ["my-custom-header"], // 可选的头部
    credentials: true // 需要证书
} })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly docItemService: docItemService) {} 
    @WebSocketServer()
    server: Server;
    private seqenceId = 0;
    private finalText = ''
    private sessionID;
    private conversationID;
    private openAIApiKey = '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'//process.env.REACT_APP_openAIApiKey;
    private textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1500,
        chunkOverlap: 200,
      });;
    private model;
    private embeddings;
    private splitDocs;
    private vectorStore;
    private memory;
    private chain;

    handleConnection(client: any, ...args: any[]) {
        console.log('Client connected:', client.id);

        //产生sessionID
        // const sessionID = uuidv4();
        // const conversationID = uuidv4();
        // setTimeout(() => {
        //     client.emit('IDs', { sessionID, conversationID });
        // }, 2000); 
    }

    handleDisconnect(client: any) {
        console.log('Client disconnected:', client.id);
    }

    @SubscribeMessage('getSession')
    handleGetSession(client: any, payload: any): string {
        console.log('message received', payload)
        this.sessionID = uuidv4();
        this.conversationID = uuidv4();
        client.emit('IDs', { sessionID: this.sessionID, conversationID: this.conversationID });
        return 'hello';
    }

    @SubscribeMessage('testmessage')
    handleMessage(client: any, payload: any): string {
        console.log('message received', payload)
        return 'Hello world!';
    }

    @SubscribeMessage('onUpload')
    async handleOnUpload(client: any, payload: any) {
        console.log('message received')
        // 获取所有文本
        let fileTexts = payload.map(content => content.fileText);

        // 使用join方法将所有的fileText合并为一个字符串
        this.finalText = fileTexts.join('');
        console.log(this.finalText)
        const newDocItems: docItem[] = [];
        //上传azure postgres doc-info数据库
        
        

        // Iterate over the payload (each item should be a FileContent object)
        for (const fileContent of payload) {
            const docItemInstance = new docItem();

            // Map FileContent properties to docItem properties
            // The properties should be replaced by your actual docItem entity properties
            docItemInstance.doc_name = fileContent.fileName;
            docItemInstance.doc_url = fileContent.fileUrl;
            docItemInstance.doc_type = 'pdf';
            var CryptoJS = require("crypto-js");
            docItemInstance.doc_sha256 = fileContent.fileSha256;
            docItemInstance.doc_available = true;
            docItemInstance.user_belonged = 'testman';
            // Add docItem to the array
            console.log(docItemInstance)
            newDocItems.push(docItemInstance);
        }

        // Save the docItems to the database
        const savedDocItems = await this.docItemService.insertDocs(newDocItems);

        //save the embeddings


        //set the chain 
        this.model = new ChatOpenAI({ modelName: "gpt-4" ,openAIApiKey:this.openAIApiKey});
        this.embeddings = new OpenAIEmbeddings({openAIApiKey:this.openAIApiKey});
        this.splitDocs = await this.textSplitter.splitDocuments([
                  new Document({ pageContent: this.finalText }),
                ])

        this.vectorStore = await MemoryVectorStore.fromDocuments(this.splitDocs, this.embeddings);
        const memory = new BufferMemory({
            memoryKey: "chat_history",
            returnMessages: true,
            });

        this.chain = ConversationalRetrievalQAChain.fromLLM(
              this.model,
              this.vectorStore.asRetriever(),
              {
                memory,
              }
            );
        console.log(this.chain)
    }


    @SubscribeMessage('onConversation')
    async handleOnConversation(client: any, payload: any) {
        console.log('message received', payload)

        // run the chain
        let result = await this.chain.call({
        question: payload,
        });
        
        console.log(result)
        client.emit('answer', { result });

        //save the conversation


        return 'Hello world!';
    }
}