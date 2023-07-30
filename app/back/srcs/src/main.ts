import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  
  app.use(
    session({
      store: new (require('connect-pg-simple')(session))({
        // Insert connect-pg-simple options here
        conString: `POSTGRESQL://${process.env.POSTGRESQL_USERNAME}:${process.env.POSTGRESQL_PASSWORD}@${process.env.POSTGRESQL_HOST}:${process.env.POSTGRESQL_PORT}/${process.env.POSTGRESQL_DATABASE}`
      }),
      secret: process.env.SESSION_SECRET ? process.env.SESSION_SECRET : "FUCK YOU MAN",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 3  // 3 hour,
      },
      name: "IamYourFather",
    })
  );
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [`http://localhost:3000`, `http://127.0.0.1:3000`],
    methods: ["POST", "GET", "PATCH", "DELETE"],
    credentials: true,
  });
  await app.listen(3001);
}
bootstrap();