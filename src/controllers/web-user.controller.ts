import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { CmsUserService } from '../services/cms-user.service';
import { UserGuard } from '../guard/user.guard';
import { PrivacyGuard } from '../guard/privacy.guard';
import { IReqEditUser } from '../dto/request/user-request/IReqEditUser';
import { WebUserService } from '../services/web-user.service';

@Controller('web/user')
export class WebUserController {
  constructor(private userService: WebUserService) {}

  @UseGuards(PrivacyGuard)
  @Put('/v1/edit')
  editUser(@Body() body: IReqEditUser) {
    return this.userService.editUser(body);
  }
}
