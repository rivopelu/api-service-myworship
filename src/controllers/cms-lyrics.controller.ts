import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CmsLyricsService } from '../services/cms-lyrics.service';
import { AdminGuard } from '../guard/admin.guard';
import { statusType } from '../utils/status-type';
import { ICreateLyricsDto } from '../dto/request/lyrics-request/ICreateLyricsDto';
import { SuperAdminGuard } from '../guard/super-admin.guard';
import { IReqRejectRevisionLyric } from '../dto/request/lyrics-request/IReqRejectRevisionLyric';

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
  @Get('v1/list/:status')
  getListAll(
    @Query('size') size: number,
    @Query('page') page: number,
    @Query('search') search: string,
    @Param('status') status: statusType,
  ) {
    return this.lyricsService.getListAll(status, { size, page, search });
  }

  // POST CONTROLLER

  @UseGuards(AdminGuard)
  @Post('/v1/new')
  requestCreatedLyrics(@Body() data: ICreateLyricsDto) {
    return this.lyricsService.requestCreateLyrics(data);
  }

  @UseGuards(AdminGuard)
  @Post('/v1/save-draft')
  saveDraftCreateLyric(@Body() body: ICreateLyricsDto) {
    return this.lyricsService.saveDraftCreateLyric(body);
  }

  // PUT CONTROLLER
  @UseGuards(AdminGuard)
  @Put('/v1/edit/:slug')
  lyricEdit(@Body() data: ICreateLyricsDto, @Param('slug') slug: string) {
    return this.lyricsService.editLyric(data, slug);
  }

  @UseGuards(SuperAdminGuard)
  @Put('/v1/need-revision/:slug')
  needRevisionLyric(
    @Body() body: IReqRejectRevisionLyric,
    @Param('slug') slug: string,
  ) {
    return this.lyricsService.needRevisionLyric(slug, body);
  }

  @UseGuards(SuperAdminGuard)
  @Put('/v1/reject/:slug')
  rejectLyric(
    @Body() body: IReqRejectRevisionLyric,
    @Param('slug') slug: string,
  ) {
    return this.lyricsService.rejectLyric(slug, body);
  }

  // PATCH CONTROLLER
  @UseGuards(SuperAdminGuard)
  @Patch('v1/approved/:slug')
  approvedLyric(@Param('slug') slug: string) {
    return this.lyricsService.approveLyric(slug);
  }
}
