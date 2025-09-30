import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(bodyParser.json({ limit: '10mb' })); // ajuste o valor conforme necessário
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  await app.listen(3002);
}
bootstrap();