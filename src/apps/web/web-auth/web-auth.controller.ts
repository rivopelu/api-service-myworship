import { Body, Controller, Post } from '@nestjs/common';
import { WebAuthService } from './web-auth.service';
import IRegisterDto from '../../../dto/request/auth-request/IRegisterDto';

@Controller('web/auth')
export class WebAuthController {
  constructor(private authService: WebAuthService) {}

  @Post('/v1/register')
  registerWeb(@Body() body: IRegisterDto) {
    return this.authService.register(body);
  }
}
