import { Body, Controller, Post } from '@nestjs/common';

@Controller('test_backend')
export class TestBackend {
  @Post()
  async receiveTextMessage(@Body() body: any) {
    console.log(body); // 查看json消息内容
    return {
      statusCode: 200,
      message: 'cors enabled',
    };
  }
}