import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ENV } from '../constants/ENV';
import BaseService from '../apps/base-service';

@Injectable()
export class MailService extends BaseService {
  constructor(private mailerService: MailerService) {
    super();
  }

  async testingEmail(email: string) {
    const url = `${ENV.CLIENT_URL}`;
    return await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './email-verification', // `.hbs` extension is appended automatically
      context: {
        name: email,
        url,
      },
    });
  }

  async sendVerification(email: string, name: string, token: string) {
    const url = `${ENV.CLIENT_URL}/email-verification?token=${token}`;
    return await this.mailerService
      .sendMail({
        to: email,
        subject: 'Welcome to My Worship! Confirm your Email',
        template: './email-verification', // `.hbs` extension is appended automatically
        context: {
          name: name,
          url,
        },
      })
      .then(() => {
        this.logger.verbose('SEND EMAIL VERIFICATION SUCCESS', email);
      });
  }
}
