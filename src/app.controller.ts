import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MailService } from './mail/mail.service';

@ApiTags('PING')
@Controller()
export class AppController {
  constructor(private mailService: MailService) {}

  @Get()
  ping(): string {
    return 'PONG';
  }

  @Get('test-email/:mail')
  testMail(@Param('mail') email: string) {
    return this.mailService.testingEmail(email).then(() => {
      return email;
    });
  }
}
