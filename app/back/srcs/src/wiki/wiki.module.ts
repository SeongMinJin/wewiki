import { Module } from '@nestjs/common';
import { WikiService } from './wiki.service';
import { WikiController } from './wiki.controller';

@Module({
  providers: [WikiService],
  controllers: [WikiController]
})
export class WikiModule {}
