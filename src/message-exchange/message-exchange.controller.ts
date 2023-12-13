import { Body, Controller, Post } from '@nestjs/common';
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";

import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";

// const openAIApiKey = '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'
// const textSplitter = new RecursiveCharacterTextSplitter({
//           chunkSize: 1500,
//           chunkOverlap: 200,
//         });
// const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" ,openAIApiKey:openAIApiKey});
// const embeddings = new OpenAIEmbeddings({openAIApiKey:openAIApiKey});

@Controller('messageExchange')
export class MessageExchangeController {
  @Post('textMessageUpload')
  async receiveTextMessage(@Body() body: any) {
    // console.log(body); // 查看文本消息内容
    
    // 这里你可以实现处理和保存消息的逻辑
    // ...

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
    // let result = await chain.call({
    //   question: body.quiz,
    // });
    // if (result == null){
    //   return {
    //     statusCode: 200,
    //     message: 'No result',
    //   };}
     
    return {
      statusCode: 200,
      message: body,
    };
  }
}