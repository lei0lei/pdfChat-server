import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT || 8080;
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors({
  //   allowedHeaders: '*',
  //   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  //   origin: 'http://localhost:3000',
  //   credentials: true,
  // });
  // const cors = require('cors');
  // app.use(cors({
  //     origin: 'http://localhost:3000', // use your actual domain name (or localhost), using * is not recommended
  //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  //     allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  //     credentials: true
  // }));
  await app.listen(port);
}
bootstrap();
