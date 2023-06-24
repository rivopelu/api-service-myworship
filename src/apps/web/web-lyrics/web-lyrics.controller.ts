import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WebLyricsService } from './web-lyrics.service';

@ApiTags('WEB LYRICS CONTROLLER')
@Controller('web/lyrics')
export class WebLyricsController {
  constructor(private lyricService: WebLyricsService) {}

  @Get('/v1/search-lyric')
  getLyricSearchByName(@Query('search') title: string) {
    return this.lyricService.getSearchLyricByName(title);
  }

  @Get('v1/detail/:slug')
  getDetailLyricWebBySlug(@Param('slug') slug: string) {
    return this.lyricService.getDetailLyricBySlugWeb(slug);
  }
}
