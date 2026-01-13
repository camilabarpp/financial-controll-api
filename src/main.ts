import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { AllExceptionsFilter } from './common/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'https://camilabarpp.github.io',
      'https://financial-controll-site.onrender.com/',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  await app.listen(process.env.PORT || 3002);
}
bootstrap();