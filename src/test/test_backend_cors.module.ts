import { Module } from '@nestjs/common';
import { TestBackend } from './test_backend_cors.controller';

@Module({
  controllers: [TestBackend],
})
export class TestBackendModule {}