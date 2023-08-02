import { Module } from '@nestjs/common';
import { WikiService } from './wiki.service';
import { WikiController } from './wiki.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wiki } from './entity/wiki.entity';
import { UserModule } from 'src/user/user.module';
import { WikiRef } from './entity/wiki.ref.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wiki, WikiRef]),
    UserModule,
  ],
  providers: [WikiService],
  controllers: [WikiController]
})
export class WikiModule {}
