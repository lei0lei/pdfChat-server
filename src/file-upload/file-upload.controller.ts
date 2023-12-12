import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('fileUpload')
export class FileUploadController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    console.log(file); // 查看文件详细信息
    // 这里你可以实现文件保存和处理的逻辑
    // ...
    return {
      statusCode: 200,
      message: '文件上传成功',
      data: file,
    };
  }
}