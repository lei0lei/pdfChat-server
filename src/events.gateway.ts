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
@WebSocketGateway({namespace: '/ws'})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    private seqenceId = 0;
    private model = {
        id: 1,
        date: 'initial state'
    }

    handleConnection(client: any, ...args: any[]) {
        console.log('Client connected:', client.id);

        //产生sessionID
        const sessionID = uuidv4();
        const conversationID = uuidv4();
        client.emit('connectionIDs', { sessionID, conversationID });

    }

    handleDisconnect(client: any) {
        console.log('Client disconnected:', client.id);
    }

    @SubscribeMessage('testmessage')
    handleMessage(client: any, payload: any): string {
        console.log('message received', payload)
        return 'Hello world!';
    }
}