import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';

import BaseService from './_base.service';

import { UtilsHelper } from '../helper/utils-helper';
import { DateHelper } from '../helper/date-helper';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Not, Repository } from 'typeorm';
import { Artist } from '../entities/Artist';
import { User } from '../entities/User';
import { Categories } from '../entities/Categories';
import { REQUEST } from '@nestjs/core';
import {
  IGenerateJwtData,
  IReqQueryParams,
} from '../utils/utils-interfaces-type';
import { IDetailLyricResponse } from '../dto/response/lyric-response/IDetailLyricResponse';
import { ICreateLyricsDto } from '../dto/request/lyrics-request/ICreateLyricsDto';
import { ReturnResponsePagination } from '../config/base-response-config';
import {
  IResListLyric,
  IResListLyricV2,
} from '../dto/response/lyric-response/IResListLyric';
import { StatusEnum } from '../enum/status-enum';
import { parseTypeStatusToEnum, statusType } from '../utils/status-type';
import { UserRoleEnum } from '../enum/user-role-enum';
import { IReqRejectRevisionLyric } from '../dto/request/lyrics-request/IReqRejectRevisionLyric';
import { TextHelper } from '../helper/text-helper';
import { LyricsRepository } from '../repositories/lyrics.repository';

@Injectable()
export class CmsLyricsService extends BaseService {
  private utilsHelper = new UtilsHelper();
  private textHelper = new TextHelper();
  private dateHelper = new DateHelper();

  constructor(
    private lyricsRepository: LyricsRepository,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
    @Inject(REQUEST) private readonly req: Request,
  ) {
    super();
  }

  async getDetailLyric(slug: string) {
    const user: IGenerateJwtData = this.req['user'];
    const getDetail = await this.lyricsRepository.findOne({
      where: {
        slug: slug,
        created_by:
          user.role === UserRoleEnum.ADMIN ? { id: user.id } : undefined,
      },
      relations: {
        artist: true,
        created_by: true,
        categories: true,
      },
    });

    if (!getDetail) {
      throw new NotFoundException('Lyric Not Found');
    } else {
      const item = getDetail;
      const dataDetail: IDetailLyricResponse = {
        title: item.title,
        youtube_url: item.youtubeUrl,
        slug: item.slug,
        created_by: item?.created_by?.name,
        lyric: item.lyric,
        publish_by: item?.approved_by?.name,
        status_enum: item.status,
        status_string: this.textHelper.toLowercaseEnum(item.status),
        artis_name: item.artist.name,
        artis_slug: item.artist.slug,
        image: item.image,
        request_notes: item.notesRequest,
        reject_revision_reason: item.notesRevisionReject,
        created_at: item.createdAt,
        description: item.description,
        categories: item.categories.map((item) => {
          return {
            name: item.name,
            slug: item.slug,
          };
        }),
      };
      return this.baseResponse.BaseResponse<IDetailLyricResponse>(dataDetail);
    }
  }

  async requestCreateLyrics(data: ICreateLyricsDto) {
    const user: IGenerateJwtData = this.req['user'];
    const getListCategories = await this.categoriesRepository.find();

    const findData = await this.lyricsRepository.findOneBy({
      slug: this.utilsHelper.generateSlug(data.title + '-' + data.artist_slug),
    });
    const findArtist = await this.artistRepository.findOneBy({
      slug: data.artist_slug,
    });
    if (!findArtist) {
      throw new BadRequestException('Artist Not Found');
    }
    const checkCategories = (): Categories[] => {
      const dataResult: Categories[] = [];
      data.categories_id.map((item: number) => {
        const data = getListCategories.find((e) => e.id === item);
        if (data) {
          dataResult.push(data);
        } else {
          throw new BadRequestException('Categories Id Not Found');
        }
      });
      return dataResult;
    };
    if (findData) {
      throw new BadRequestException('Title Already Exist');
    } else {
      const newData = await this.lyricsRepository.save({
        title: data.title,
        slug: this.utilsHelper.generateSlug(data.title) + '-' + findArtist.slug,
        description: data.description,
        lyric: data.lyric,
        youtubeUrl: data.youtube_url,
        categories: checkCategories(),
        created_by: { id: user.id },
        artist: findArtist,
        notesRequest: data.notes,
        status: StatusEnum.PENDING,
        image: data?.image ? data.image : null,
      });
      if (newData) {
        return this.baseResponse.BaseResponseWithMessage('Success Request');
      }
    }
  }

  async getListAll(
    status: statusType,
    param: IReqQueryParams,
  ): ReturnResponsePagination<IResListLyric[]> {
    this.setPaginationData({
      search: param.search,
      page: param.page,
      size: param.size,
    });
    const user: IGenerateJwtData = this.req['user'];
    const [data, count] = await this.lyricsRepository.findAndCount({
      where: {
        status:
          status === 'all' && user.role === UserRoleEnum.SUPER_ADMIN
            ? Not(StatusEnum.DRAFT)
            : parseTypeStatusToEnum(status),
        created_by:
          user.role === UserRoleEnum.ADMIN ? { id: user.id } : undefined,
        title: param?.search ? Like(`%${param.search}%`) : undefined,
      },
      relations: {
        artist: true,
        created_by: true,
        approved_by: true,
        categories: true,
      },
      order: { createdAt: 'DESC' },
      take: this.paginationSize,
      skip: this.paginationSkip,
    });
    if (data) {
      const listDataRes: IResListLyric[] = data.map((item) => {
        return {
          title: item.title,
          slug: item.slug,
          artis_name: item.artist.name,
          artis_slug: item.artist.slug,
          image: item?.image ? item.image : null,
          status_enum: item.status,
          status_string: this.textHelper.toLowercaseEnum(item.status),
          created_at: this.dateHelper.parseToUtc(item.createdAt),
          publish_by: item?.approved_by?.name,
          created_by: item?.created_by?.name,
          id: item.id,
        };
      });
      return this.baseResponse.baseResponsePageable(listDataRes, {
        size: this.paginationSize,
        page: this.paginationPage,
        total_data: count,
      });
    }
  }

  public async getListAllV2(
    status: statusType,
    param: IReqQueryParams,
  ): ReturnResponsePagination<IResListLyricV2[]> {
    this.setPaginationData({
      search: param.search,
      page: param.page,
      size: param.size,
    });
    const user: IGenerateJwtData = this.req['user'];
    const count = await this.lyricsRepository.count({
      where: {
        status:
          status === 'all' && user.role === UserRoleEnum.SUPER_ADMIN
            ? Not(StatusEnum.DRAFT)
            : parseTypeStatusToEnum(status),
        created_by:
          user.role === UserRoleEnum.ADMIN ? { id: user.id } : undefined,
        title: param?.search ? Like(`%${param.search}%`) : undefined,
      },
    });

    const data = await this.lyricsRepository.findListLyricCmsAndCount(
      {
        categories: param.categories,
        page: this.paginationPage,
        search: param.search,
        size: this.paginationSize,
      },
      this.textHelper.checkStatus(status),
    );

    if (data) {
      const listDataRes: IResListLyricV2[] = data.map((item) => {
        return {
          title: item.title,
          slug: item.slug,
          artist_name: item.artist_name,
          artist_slug: item.artist_slug,
          image: item?.image ? item.image : null,
          status_enum: item.status_enum,
          status_string: this.textHelper.toLowercaseEnum(item.status_enum),
          created_at: this.dateHelper.parseToUtc(item.created_at),
          publish_by: item?.publish_by,
          created_by: item?.created_by,
          id: item.id,
          total_comment: parseInt(item.total_comment.toString()),
          total_like: parseInt(item.total_like.toString()),
          total_view: parseInt(item.total_view.toString()),
          publish_at: this.dateHelper.parseToUtc(item.publish_at),
        };
      });
      return this.baseResponse.baseResponsePageable(listDataRes, {
        size: this.paginationSize,
        page: this.paginationPage,
        total_data: count,
      });
    }
  }

  async approveLyric(slug: string) {
    const user: IGenerateJwtData = this.req['user'];
    const findData = await this.lyricsRepository.findOneBy({
      slug: slug,
      status: StatusEnum.PENDING,
    });
    if (!findData) {
      throw new NotFoundException('Lyrics Not Found');
    } else {
      const updatedData = await this.lyricsRepository.update(
        { id: findData.id },
        {
          status: StatusEnum.PUBLISH,
          publishAt: new Date(),
          approved_by: { id: user.id },
        },
      );
      if (updatedData) {
        return this.baseResponse.BaseResponseWithMessage('Approved Success');
      }
    }
  }

  async editLyric(data: ICreateLyricsDto, slug: string) {
    const user: IGenerateJwtData = this.req['user'];

    const findData = await this.lyricsRepository.findOne({
      where: {
        slug: slug,
        created_by: {
          id: user.id,
        },
      },
      relations: {
        categories: true,
      },
    });
    const findArtist = await this.artistRepository.findOneBy({
      slug: data.artist_slug,
    });
    if (!findArtist) {
      throw new BadRequestException('Artist Not Found');
    }

    if (!findData) {
      throw new NotFoundException('Lyric Not Found');
    } else {
      const existingLyric = await this.lyricsRepository.findOne({
        where: { id: findData.id },
        relations: ['categories'],
      });

      existingLyric.categories = await this.categoriesRepository.findBy({
        id: In(data.categories_id),
      });
      const newData = await this.lyricsRepository.update(
        { id: findData.id }, // TODO 500 on edit lyric
        {
          title: data.title,
          slug: this.utilsHelper.generateSlug(data.title),
          description: data.description,
          lyric: data.lyric,
          youtubeUrl: data.youtube_url,
          categories: existingLyric.categories,
          created_by: { id: user.id },
          artist: findArtist,
          notesRequest: data.notes,
          status: StatusEnum.PENDING,
          image: data?.image ? data.image : null,
        },
      );
      if (newData) {
        return this.baseResponse.BaseResponseWithMessage('Success Request');
      }
    }
  }

  async saveDraftCreateLyric(data: ICreateLyricsDto) {
    const user: IGenerateJwtData = this.req['user'];
    const getListCategories = await this.categoriesRepository.find();

    const findData = await this.lyricsRepository.findOneBy({
      slug: this.utilsHelper.generateSlug(data.title),
    });
    const findArtist = await this.artistRepository.findOneBy({
      slug: data.artist_slug,
    });
    if (!findArtist) {
      throw new BadRequestException('Artist Not Found');
    }
    const checkCategories = (): Categories[] => {
      const dataResult: Categories[] = [];
      data.categories_id.map((item: number) => {
        const data = getListCategories.find((e) => e.id === item);
        if (data) {
          dataResult.push(data);
        } else {
          throw new BadRequestException('Categories Id Not Found');
        }
      });
      return dataResult;
    };
    if (findData) {
      throw new BadRequestException('Title Already Exist');
    } else {
      const newData = await this.lyricsRepository.save({
        title: data.title,
        slug: this.utilsHelper.generateSlug(data.title),
        description: data.description,
        lyric: data.lyric,
        categories: checkCategories(),
        created_by: { id: user.id },
        artist: findArtist,
        notesRequest: data.notes,
        status: StatusEnum.DRAFT,
        image: data?.image ? data.image : null,
      });
      if (newData) {
        return this.baseResponse.BaseResponseWithMessage('Success Save Draft');
      }
    }
  }

  async needRevisionLyric(slug: string, body: IReqRejectRevisionLyric) {
    const findData = await this.lyricsRepository.findOneBy({
      slug: slug,
      status: StatusEnum.PENDING,
    });
    if (!findData) {
      throw new NotFoundException('Lyric Not Found');
    } else {
      const updateData = await this.lyricsRepository.update(
        {
          slug: slug,
        },
        {
          status: StatusEnum.NEED_REVISION,
          notesRevisionReject: body.reason,
        },
      );
      if (updateData) {
        return this.baseResponse.BaseResponseWithMessage(
          'Need Revision Success',
        );
      }
    }
  }

  async rejectLyric(slug: string, body: IReqRejectRevisionLyric) {
    const findData = await this.lyricsRepository.findOneBy({
      slug: slug,
      status: StatusEnum.PENDING,
    });
    if (!findData) {
      throw new NotFoundException('Lyric Not Found');
    } else {
      const updateData = await this.lyricsRepository.update(
        {
          slug: slug,
        },
        {
          status: StatusEnum.REJECT,
          notesRevisionReject: body.reason,
        },
      );
      if (updateData) {
        return this.baseResponse.BaseResponseWithMessage('Reject Success');
      }
    }
  }
}
