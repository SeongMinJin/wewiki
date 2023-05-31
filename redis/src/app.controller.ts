import { Controller, Get } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern('notifications')
  getNotifications(@Payload() data: number[], @Ctx() context: RedisContext) {
    console.log(`Channel: ${context.getChannel()}`);
  }
}
