import { Module } from '@nestjs/common';
import { MessageExchangeController } from './message-exchange.controller';

@Module({
  controllers: [MessageExchangeController],
})
export class MessageExchangeModule {}