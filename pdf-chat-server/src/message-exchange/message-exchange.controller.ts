import { Body, Controller, Post } from '@nestjs/common';

@Controller('messageExchange')
export class MessageExchangeController {
  @Post('textMessageUpload')
  receiveTextMessage(@Body() body: any) {
    console.log(body); // 查看文本消息内容
    // 这里你可以实现处理和保存消息的逻辑
    // ...
    return {
      statusCode: 200,
      message: '消息接收成功',
      data: body,
    };
  }
}