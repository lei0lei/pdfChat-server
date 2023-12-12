import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileUploadController } from './file-upload.controller';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // 文件保存路径
    }),
  ],
  controllers: [FileUploadController],
})
export class FileUploadModule {}