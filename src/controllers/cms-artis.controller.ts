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
import { CmsArtisService } from '../services/cms-artis.service';
import { statusType } from '../utils/status-type';
import { IListArtistResponse } from '../dto/response/artist-response/IListArtistResponse';
import {
  ReturnResponsePagination,
  ReturnResponseWithMessage,
} from '../config/base-response-config';
import { ICreatedArtistDto } from '../dto/request/artis-request/ICreatedArtistDto';
import { SuperAdminGuard } from '../guard/super-admin.guard';
import { IReqRejectReviseArtist } from '../dto/request/artis-request/IReqRejectReviseArtist';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../guard/admin.guard';

@ApiTags('CMS ARTIST CONTROLLER')
@Controller('cms/artist')
export class CmsArtisController {
  constructor(private artisService: CmsArtisService) {}

  @UseGuards(AdminGuard)
  @Get('v1/list/:status')
  getListArtist(
    @Query('size') size: number,
    @Query('page') page: number,
    @Query('search') search: string,
    @Param('status') status: statusType,
  ): ReturnResponsePagination<IListArtistResponse[]> {
    return this.artisService.getListArtistAll(status, { size, page, search });
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
  @Get('/v1/detail/:slug')
  getDetailArtistById(@Param('slug') id: string) {
    return this.artisService.getDetailArtistById(id);
  }

  @UseGuards(AdminGuard)
  @Get('v1/list/need-revision')
  getListNeedRevision(
    @Query('size') size: number,
    @Query('page') page: number,
    @Query('search') search: string,
  ): ReturnResponsePagination<IListArtistResponse[]> {
    return this.artisService.getListArtistNeedRevision({ size, page, search });
  }

  // POST
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

  // PUT
  @UseGuards(SuperAdminGuard)
  @Put('/v1/need-revision/:slug')
  needRevisionArtist(
    @Body() data: IReqRejectReviseArtist,
    @Param('slug') slug: string,
  ) {
    return this.artisService.needRevisionArtist(slug, data);
  }

  @UseGuards(AdminGuard)
  @Put('v1/submit-revision/:slug')
  submitRevisionArtist(
    @Param('slug') slug: string,
    @Body() data: ICreatedArtistDto,
  ) {
    return this.artisService.submitRevisionArtist(slug, data);
  }

  @UseGuards(AdminGuard)
  @Put('/v1/edit/:id')
  editArtist(@Body() data: ICreatedArtistDto, @Param('id') id: string) {
    return this.artisService.updatedArtis(id, data);
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

  @UseGuards(SuperAdminGuard)
  @Put('/v1/reject/:slug')
  rejectArtist(
    @Body() body: IReqRejectReviseArtist,
    @Param('slug') slug: string,
  ) {
    return this.artisService.rejectArtist(body, slug);
  }

  @Get('/v1/list-select')
  @UseGuards(AdminGuard)
  getListAllArtistSelect() {
    return this.artisService.getListAllArtistSelect();
  }
}
