import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileUploadModule } from './file-upload/file-upload.module';
import { MessageExchangeModule } from './message-exchange/message-exchange.module';


@Module({
  imports: [MessageExchangeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
