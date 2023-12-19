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
    private model = {
        id: 1,
        date: 'initial state'
    }

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
        const sessionID = uuidv4();
        const conversationID = uuidv4();
        client.emit('IDs', { sessionID, conversationID });
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
            docItemInstance.doc_sha256 = fileContent.fileSha256;
            docItemInstance.doc_available = true;
            docItemInstance.user_belonged = 'testman';
            // Add docItem to the array
            newDocItems.push(docItemInstance);
        }

        // Save the docItems to the database
        const savedDocItems = await this.docItemService.insertDocs(newDocItems);




       
    }


    @SubscribeMessage('onConversation')
    handleOnConversation(client: any, payload: any): string {
        console.log('message received', payload)
        return 'Hello world!';
    }
}