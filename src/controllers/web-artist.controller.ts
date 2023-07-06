import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WebArtistService } from '../services/web-artist.service';

@ApiTags('CMS ARTIST CONTROLLER')
@Controller('web/artist')
export class WebArtistController {
  constructor(private artistService: WebArtistService) {}

  @Get('v1/detail/:slug')
  getDetailArtist(@Param('slug') slug: string) {
    return this.artistService.getDetailArtistBySlug(slug);
  }
}
