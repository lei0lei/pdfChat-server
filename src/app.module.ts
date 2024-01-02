import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileUploadModule } from './file-upload/file-upload.module';
import { MessageExchangeModule } from './message-exchange/message-exchange.module';
import { TestBackendModule } from './test/test_backend_cors.module';
import { EventsGateway } from './events.gateway';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { docItemService } from './doc/doc_info.service';
import { docItem } from './doc/doc_info.entity';
import { conversationItemService } from './conversation/conversation_info.service';
import { conversationItem } from './conversation/conversation_info.entity';
import { openaiVectordbService } from './openai_vectordb/openai_vectordb.service';
import { openaiVectordbItem } from './openai_vectordb/openai_vectordb.entity';


import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';


@Module({
  imports: [MessageExchangeModule,TestBackendModule,ConfigModule.forRoot({
    isGlobal: true
  }),TypeOrmModule.forFeature([docItem,conversationItem,openaiVectordbItem]),TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'pdfchat.postgres.database.azure.com',
    port: 5432,
    username: 'boyan',
    password: 'Donkeygauss.pwd',
    database: 'postgres',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false,
  }),AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService,EventsGateway,docItemService,conversationItemService,openaiVectordbService],
})
export class AppModule {}
