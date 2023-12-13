import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT || 8080;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: '*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    origin: 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(port);
}
bootstrap();
