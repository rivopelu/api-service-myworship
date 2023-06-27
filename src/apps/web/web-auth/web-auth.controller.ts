import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WebAuthService } from './web-auth.service';
import IRegisterDto from '../../../dto/request/auth-request/IRegisterDto';
import ILoginDto, {
  ILoginGoogle,
} from '../../../dto/request/auth-request/ILoginDto';
import { UserGuard } from '../../../guard/user.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('WEB AUTH CONTROLLER')
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

  @Post('/v1/register-google')
  registerWithGoogle(@Body() body: ILoginGoogle) {
    return this.authService.registerWithGoogle(body.token);
  }

  @Post('/v1/login-google')
  loginWebGoogle(@Body() body: ILoginGoogle) {
    return this.authService.loginGoogle(body);
  }

  @Get('v1/get-me')
  @UseGuards(UserGuard)
  getMeData() {
    return this.authService.getMeData();
  }

  @Patch('v1/verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Patch('v1/resend-verification-email')
  resendVerificationEmail(@Query('email') email: string) {
    return this.authService.resendVerificationEmail(email);
  }
}
