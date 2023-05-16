import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '@guard/admin.guard';
import { ICreateLyricsDto } from '@dto/request/lyrics-request/ICreateLyricsDto';
import { CmsLyricsService } from '@apps/cms/cms-lyrics/cms-lyrics.service';
import { SuperAdminGuard } from '@guard/super-admin.guard';

@ApiTags('CMS LYRICS CONTROLLER')
@Controller('cms/lyrics')
export class CmsLyricsController {
  constructor(private lyricsService: CmsLyricsService) {}

  // GET CONTROLLER

  @UseGuards(AdminGuard)
  @Get('/v1/detail/:slug')
  getDetailBySlug(@Param('slug') slug: string) {
    return this.lyricsService.getDetailLyric(slug);
  }

  @UseGuards(AdminGuard)
  @Get('v1/list/all')
  getListAll(
    @Query('size') size: number,
    @Query('page') page: number,
    @Query('search') search: string,
  ) {
    return this.lyricsService.getListAll({ size, page, search });
  }

  // POST CONTROLLER

  @UseGuards(AdminGuard)
  @Post('/v1/new')
  requestCreatedLyrics(@Body() data: ICreateLyricsDto) {
    return this.lyricsService.requestCreateLyrics(data);
  }

  // PATCH CONTROLLER
  @UseGuards(SuperAdminGuard)
  @Patch('v1/approved/:slug')
  approvedLyric(@Param('slug') slug: string) {
    return this.lyricsService.approveLyric(slug);
  }
}
