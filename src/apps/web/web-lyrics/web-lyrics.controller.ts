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
import { WebLyricsService } from './web-lyrics.service';
import { IReqCommentLyrics } from '../../../dto/request/lyrics-request/IReqCommentLyrics';
import { UserGuard } from '../../../guard/user.guard';
import { IReqAddSubLyricComment } from '../../../dto/request/lyrics-request/IReqAddSubLyricComment';

@ApiTags('WEB LYRICS CONTROLLER')
@Controller('web/lyrics')
export class WebLyricsController {
  constructor(private lyricService: WebLyricsService) {}

  @UseGuards(UserGuard)
  @Post('/v1/add-comment')
  addCommentLyrics(@Body() body: IReqCommentLyrics) {
    return this.lyricService.addCommentLyrics(body);
  }

  @UseGuards(UserGuard)
  @Post('/v1/add-sub-comment')
  addSubCommentLyrics(@Body() body: IReqAddSubLyricComment) {
    return this.lyricService.addSubCommentLyrics(body);
  }

  @Get('/v1/search-lyric')
  getLyricSearchByName(@Query('search') title: string) {
    return this.lyricService.getSearchLyricByName(title);
  }

  @Get('v1/detail/:slug')
  getDetailLyricWebBySlug(@Param('slug') slug: string) {
    return this.lyricService.getDetailLyricBySlugWeb(slug);
  }

  @Get('v1/comment/:slug')
  getCommentLyrics(@Param('slug') slug: string) {
    return this.lyricService.getCommentLyrics(slug);
  }

  @Get('v1/comment/all/:slug')
  getCommentLyricsAll(@Param('slug') slug: string) {
    return this.lyricService.getCommentLyricsAll(slug);
  }

  @UseGuards(UserGuard)
  @Patch('v1/like/:slug')
  likeUnLikeLyrics(@Param('slug') slug: string) {
    return this.lyricService.likeUnLikeLyrics(slug);
  }

  @Get('/v1/list/artist/:slug')
  getListPaginationLyricByArtistSlug(
    @Param('slug') slug: string,
    @Query('size') size: number,
    @Query('page') page: number,
  ) {
    return this.lyricService.getListPaginationByArtistSlug(slug, {
      size: size,
      page: page,
    });
  }
}
