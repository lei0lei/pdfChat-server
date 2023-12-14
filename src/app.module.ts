import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileUploadModule } from './file-upload/file-upload.module';
import { MessageExchangeModule } from './message-exchange/message-exchange.module';
import { TestBackendModule } from './test/test_backend_cors.module';

import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [MessageExchangeModule,TestBackendModule,ConfigModule.forRoot({
    isGlobal: true
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
