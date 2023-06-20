import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICreateLyricsDto } from '@dto/request/lyrics-request/ICreateLyricsDto';
import { UtilsHelper } from '@helper/utils-helper';
import { InjectRepository } from '@nestjs/typeorm';
import { Lyrics } from '@entities/Lyrics';
import { Like, Not, Repository } from 'typeorm';
import { User } from '@entities/User';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import {
  IGenerateJwtData,
  IPaginationQueryParams,
} from '@utils/utils-interfaces-type';
import { Categories } from '@entities/Categories';
import { Artist } from '@entities/Artist';
import BaseService from '@apps/base-service';
import { UserRoleEnum } from '@enum/user-role-enum';
import { IDetailLyricResponse } from '@dto/response/lyric-response/IDetailLyricResponse';
import { IResListLyric } from '@dto/response/lyric-response/IResListLyric';
import { ReturnResponsePagination } from '@config/base-response-config';
import { TextHelper } from '@helper/text-helper';
import { StatusEnum } from '@enum/status-enum';
import { parseTypeStatusToEnum, statusType } from '@utils/status-type';
import { DateHelper } from '@helper/date-helper';
import { IReqRejectRevisionLyric } from '@dto/request/lyrics-request/IReqRejectRevisionLyric';

@Injectable()
export class CmsLyricsService extends BaseService {
  private utilsHelper = new UtilsHelper();
  private textHelper = new TextHelper();
  private dateHelper = new DateHelper();

  constructor(
    @InjectRepository(Lyrics)
    private lyricsRepository: Repository<Lyrics>,
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
    param: IPaginationQueryParams,
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
    const getListCategories = await this.categoriesRepository.find();

    const findData = await this.lyricsRepository.findOne({
      where: {
        slug: slug,
        created_by: {
          id: user.id,
        },
      },
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
    if (!findData) {
      throw new NotFoundException('Lyric Not Found'); // ERROR IN EDIT LIRIK
    } else {
      const newData = await this.lyricsRepository.update(
        { id: findData.id },
        {
          title: data.title,
          slug: this.utilsHelper.generateSlug(data.title),
          description: data.description,
          lyric: data.lyric,
          categories: checkCategories(),
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
