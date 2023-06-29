import { Controller, Get } from '@nestjs/common';
import { WebLayoutsService } from './web-layouts.service';
import { ReturnBaseResponse } from '../../../config/base-response-config';
import { IResLayoutsGetHomeContent } from '../../../dto/response/layouts-response/IResLayoutsGetHomeContent';

@Controller('web/layouts')
export class WebLayoutsController {
  constructor(private layoutsService: WebLayoutsService) {}

  @Get('v1/home-content')
  getHomeContent(): ReturnBaseResponse<IResLayoutsGetHomeContent> {
    return this.layoutsService.getHomeContent();
  }
}
