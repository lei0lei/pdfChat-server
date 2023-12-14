import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileUploadModule } from './file-upload/file-upload.module';
import { MessageExchangeModule } from './message-exchange/message-exchange.module';
import { CorsModule } from '@nestjs/cors';

import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [CorsModule,MessageExchangeModule,ConfigModule.forRoot({
    isGlobal: true
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
