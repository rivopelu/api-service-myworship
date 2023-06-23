import { Controller, Get, Query } from '@nestjs/common';
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
}
