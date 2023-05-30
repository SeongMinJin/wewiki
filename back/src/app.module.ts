import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { WikiModule } from './wiki/wiki.module';
import { CommentModule } from './comment/comment.module';
import { PassportModule } from '@nestjs/passport';
require("dotenv").config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRESQL_HOST,
      port: parseInt(process.env.POSTGRESQL_PORT ? process.env.POSTGRESQL_PORT : "5432"),
      username: process.env.POSTGRESQL_USERNAME,
      password: process.env.POSTGRESQL_PASSWORD,
      database: process.env.POSTGRESQL_DATABASE,
      entities: [join(__dirname, "/**/entity/*.{js,ts}")],
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    UserModule,
    WikiModule,
    CommentModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
