import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cors = require('cors');
  app.enableCors()
  await app.listen(port);
}
bootstrap();
