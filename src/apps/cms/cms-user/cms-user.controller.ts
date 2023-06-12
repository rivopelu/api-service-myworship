import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CmsUserService } from '@apps/cms/cms-user/cms-user.service';
import { AdminGuard } from '@guard/admin.guard';

@ApiTags('CMS USER CONTROLLER')
@Controller('cms/user')
export class CmsUserController {
  constructor(private userService: CmsUserService) {}

  @UseGuards(AdminGuard)
  @Get('v1/get-me-data')
  getMeData() {
    return this.userService.getMeData();
  }
}
