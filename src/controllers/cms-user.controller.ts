import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CmsUserService } from '../services/cms-user.service';
import { AdminGuard } from '../guard/admin.guard';
import { SuperAdminGuard } from '../guard/super-admin.guard';
import { roleUserType } from '../utils/status-type';

@ApiTags('CMS USER CONTROLLER_')
@Controller('cms/user')
export class CmsUserController {
  constructor(private userService: CmsUserService) {}

  @UseGuards(AdminGuard)
  @Get('v1/get-me-data')
  getMeData() {
    return this.userService.getMeData();
  }

  @UseGuards(SuperAdminGuard)
  @Get('v1/list/:role')
  getListUser(
    @Query('size') size: number,
    @Query('page') page: number,
    @Query('search') search: string,
    @Param('role') role: roleUserType,
  ) {
    return this.userService.getLisUser(role, { size, page, search });
  }
}
