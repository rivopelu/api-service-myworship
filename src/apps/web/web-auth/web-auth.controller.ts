import { Body, Controller, Post } from '@nestjs/common';
import { WebAuthService } from './web-auth.service';
import IRegisterDto from '../../../dto/request/auth-request/IRegisterDto';
import ILoginDto, {
  ILoginGoogle,
} from '../../../dto/request/auth-request/ILoginDto';

@Controller('web/auth')
export class WebAuthController {
  constructor(private authService: WebAuthService) {}

  @Post('/v1/register')
  registerWeb(@Body() body: IRegisterDto) {
    return this.authService.register(body);
  }

  @Post('/v1/login')
  loginWeb(@Body() body: ILoginDto) {
    return this.authService.login(body);
  }

  @Post('/v1/login-google')
  loginWebGoogle(@Body() body: ILoginGoogle) {
    return this.authService.loginGoogle(body);
  }
}
