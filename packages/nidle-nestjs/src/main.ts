import { join } from 'path';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import * as session from 'express-session';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
// import { ResponseInterceptor } from './interceptor';
// import { AllExceptionFilter } from './filter';
// import CONST from './const';

async function bootstrap() {
  const {
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD,
    REDIS_DB_INDEX,
    SWAGGER,
    PORT,
    HOST,
  } = process.env;
  // Initialize client.
  const redisClient = createClient({
    url: `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB_INDEX}`,
  });
  redisClient.connect().catch(console.error);

  // Initialize store.
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'nidle-session:',
  });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // app.setGlobalPrefix('api'); // 在 system.module.ts 中注册接口前缀, 避免影响 /queues
  app.useGlobalPipes(new ValidationPipe());
  // 在 app.module.ts 中注册, 方便使用 winston logger
  // app.useGlobalInterceptors(new ResponseInterceptor());
  // app.useGlobalFilters(new AllExceptionFilter());

  // app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  app.use(
    session({
      name: 'NIDLE_V2_SESSION',
      store: redisStore,
      resave: false, // required: force lightweight session keep alive (touch)
      saveUninitialized: false, // recommended: only save session when data exists
      secret: 'nidle-yanuoda',
      cookie: { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true },
    }),
  );

  if (SWAGGER === 'true') {
    const options = new DocumentBuilder()
      .setTitle('nidle-nestjs api 文档')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);
  }

  await app.listen(PORT, HOST);
}
bootstrap();
