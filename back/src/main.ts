import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(
    session({
      // store: new (require('connect-pg-simple')(session))({
      //   // Insert connect-pg-simple options here

      // }),
      secret: process.env.SESSION_SECRET ? process.env.SESSION_SECRET : "FUCK YOU MAN",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000,
      }
    })
  );
  app.use(cookieParser());
  await app.listen(3001);
}
bootstrap();
