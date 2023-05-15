import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '@guard/admin.guard';
import { CmsArtisService } from '@apps/cms/cms-artis/cms-artis.service';
import {
  ReturnResponsePagination,
  ReturnResponseWithMessage,
} from '@config/base-response-config';
import { ICreatedArtistDto } from '@dto/request/artis-request/ICreatedArtistDto';
import { IListArtistResponse } from '@dto/request/response/artist-response/IListArtistResponse';
import { SuperAdminGuard } from '@guard/super-admin.guard';

@Controller('cms/artist')
export class CmsArtisController {
  constructor(private artisService: CmsArtisService) {}

  @UseGuards(AdminGuard)
  @Get('v1/list')
  getListArtist(
    @Query('size') size: number,
    @Query('page') page: number,
    @Query('search') search: string,
  ): ReturnResponsePagination<IListArtistResponse[]> {
    return this.artisService.getListArtistAll({ size, page, search });
  }

  @UseGuards(AdminGuard)
  @Get('v1/list/draft')
  getListArtistDraft(
    @Query('size') size: number,
    @Query('page') page: number,
    @Query('search') search: string,
  ): ReturnResponsePagination<IListArtistResponse[]> {
    return this.artisService.getListArtistDraftUser({ size, page, search });
  }

  @UseGuards(AdminGuard)
  @Post('/v1/new')
  createArtist(@Body() data: ICreatedArtistDto): ReturnResponseWithMessage {
    return this.artisService.createdArtis(data);
  }

  @UseGuards(AdminGuard)
  @Post('/v1/new-draft')
  savedDraftRequestArtist(
    @Body() data: ICreatedArtistDto,
  ): ReturnResponseWithMessage {
    return this.artisService.savedDraftRequestArtist(data);
  }

  @UseGuards(AdminGuard)
  @Put('/v1/edit/:id')
  editArtist(@Body() data: ICreatedArtistDto, @Param('id') id: string) {
    return this.artisService.updatedArtis(id, data);
  }

  @UseGuards(AdminGuard)
  @Get('/v1/detail/:id')
  getDetailArtistById(@Param('id') id: string) {
    return this.artisService.getDetailArtistById(id);
  }

  @UseGuards(AdminGuard)
  @Delete('/v1/delete/:id')
  deleteArtist(@Param('id') id: string) {
    return this.artisService.deleteArtist(id);
  }

  @UseGuards(SuperAdminGuard)
  @Patch('/v1/approved/:slug')
  approveArtist(@Param('slug') slug: string) {
    return this.artisService.approvedArtistRequest(slug);
  }
}
