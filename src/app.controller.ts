import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('PING')
@Controller()
export class AppController {
  @Get()
  ping(): string {
    return 'PONG';
  }
}
