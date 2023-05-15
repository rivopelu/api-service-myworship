import { Body, Controller, Post } from '@nestjs/common';
import { CmsAuthService } from './cms-auth.service';
import {
  ReturnBaseResponse,
  ReturnResponseWithMessage,
} from '@config/base-response-config';
import { ISuccessLoginResponse } from '@dto/request/response/auth-response/ISuccessLoginResponse';
import IRegisterDto from '@dto/request/auth-request/IRegisterDto';
import ILoginDto from '@dto/request/auth-request/ILoginDto';
import { ApiTags } from '@nestjs/swagger';

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
}
