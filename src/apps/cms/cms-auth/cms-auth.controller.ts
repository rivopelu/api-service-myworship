import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CmsAuthService } from './cms-auth.service';
import { ApiTags } from '@nestjs/swagger';
import IRegisterDto from '../../../dto/request/auth-request/IRegisterDto';
import {
  ReturnBaseResponse,
  ReturnResponseWithMessage,
} from '../../../config/base-response-config';
import ILoginDto, {
  ILoginGoogle,
} from '../../../dto/request/auth-request/ILoginDto';
import { ISuccessLoginResponse } from '../../../dto/response/auth-response/ISuccessLoginResponse';
import { HttpStatusCode } from 'axios';

@ApiTags('CMS AUTH CONTROLLER')
@Controller('cms/auth')
export class CmsAuthController {
  constructor(private authService: CmsAuthService) {}

  @Post('/v1/register')
  register(@Body() data: IRegisterDto): ReturnResponseWithMessage {
    return this.authService.register(data);
  }

  @Post('v1/login')
  login(@Body() data: ILoginDto): ReturnBaseResponse<ISuccessLoginResponse> {
    return this.authService.login(data);
  }

  @Post('v1/google-login')
  loginGoogle(
    @Body() data: ILoginGoogle,
  ): ReturnBaseResponse<ISuccessLoginResponse> {
    return this.authService.loginWithGoogle(data.token);
  }
}
