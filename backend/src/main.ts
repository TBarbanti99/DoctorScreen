import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { error } from './middleware/middleware.error';
import * as bodyParser from 'body-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('/api/v1');
  app.enableCors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })

  app.setGlobalPrefix("/api/v1")
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

  app.setViewEngine('ejs');
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  

  await app
    .listen(process.env.PORT!)
    .then(() => {
      console.log(`Server running on port ${process.env.PORT}!`);
    })
    .catch((err) => {
      console.error('Error starting server:', err);
      process.exit(1);
    });
  app.use(error);
  // errors handling
  process.on('uncaughtException', (err: any) => {
    console.log(`uncaughtException error due to ${err?.message}`);
    console.log('server is shutting down');
    process.exit(1); // kill the node process
  });

  process.on('unhandledRejection', (err: any) => {
    console.log(`Unhandled rejection error due to ${err?.message}`);
    console.log('server is shutting down');
    process.exit(1); // kill the node process
  });
}
bootstrap();
