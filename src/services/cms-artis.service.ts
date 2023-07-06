import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DateHelper } from '../helper/date-helper';
import { Artist } from '../entities/Artist';
import { User } from '../entities/User';
import { ICreatedArtistDto } from '../dto/request/artis-request/ICreatedArtistDto';
import {
  ReturnBaseResponse,
  ReturnResponsePagination,
  ReturnResponseWithMessage,
} from '../config/base-response-config';
import {
  IGenerateJwtData,
  IPaginationQueryParams,
} from '../utils/utils-interfaces-type';
import { IResListArtistSelect } from '../dto/response/artist-response/IResListArtistSelect';
import { StatusEnum } from '../enum/status-enum';
import { IReqRejectReviseArtist } from '../dto/request/artis-request/IReqRejectReviseArtist';
import { IListArtistResponse } from '../dto/response/artist-response/IListArtistResponse';
import {
  parseEnumStatusToType,
  parseTypeStatusToEnum,
  statusType,
} from '../utils/status-type';
import { UserRoleEnum } from '../enum/user-role-enum';
import { IDetailArtistResponse } from '../dto/response/artist-response/IDetailArtistResponse';
import BaseService from './_base.service';

@Injectable()
export class CmsArtisService extends BaseService {
  public dateHelper = new DateHelper();

  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(REQUEST) private readonly req: Request,
  ) {
    super();
  }

  private generateSlug(data: string) {
    return data.split(' ').join('-').toLowerCase();
  }

  async createdArtis(data: ICreatedArtistDto): ReturnResponseWithMessage {
    const user: IGenerateJwtData = this.req['user'];
    if (user) {
      const findUser = await this.userRepository.findOneBy({
        username: user.username,
      });
      const slug = this.generateSlug(data.name);
      const findArtis = await this.artistRepository.findOneBy({ slug: slug });
      if (findArtis) {
        throw new BadRequestException('Nama Artis Telah Ada');
      } else {
        if (findUser) {
          const newArtis = await this.artistRepository.save({
            name: data.name,
            slug: slug,
            description: data.description,
            created_by: findUser,
            notesRequest: data.notes,
            status: StatusEnum.PENDING,
            image: data?.image ? data.image : null,
          });
          if (newArtis) {
            return this.baseResponse.BaseResponseWithMessage('SUCCESS');
          }
        }
      }
    }
  }

  async savedDraftRequestArtist(
    data: ICreatedArtistDto,
  ): ReturnResponseWithMessage {
    const user: IGenerateJwtData = this.req['user'];
    if (user) {
      const findUser = await this.userRepository.findOneBy({
        username: user.username,
      });
      const slug = this.generateSlug(data.name);
      const findArtis = await this.artistRepository.findOneBy({ slug: slug });
      if (findArtis) {
        throw new BadRequestException('Nama Artis Telah Ada');
      } else {
        if (findUser) {
          const newArtis = await this.artistRepository.save({
            name: data.name,
            slug: slug,
            description: data.description,
            created_by: findUser,
            notesRequest: data.notes,
            status: StatusEnum.DRAFT,
            image: data?.image ? data.image : undefined,
          });
          if (newArtis) {
            return this.baseResponse.BaseResponseWithMessage('SUCCESS');
          }
        }
      }
    }
  }

  async updatedArtis(id: string, data: ICreatedArtistDto) {
    const findArtist = await this.artistRepository.findOneBy({ slug: id });
    if (!findArtist) {
      throw new NotFoundException('Artist Not Found');
    } else {
      const slug = this.generateSlug(data.name);
      const newArtistDataUpdate = await this.artistRepository.update(
        {
          slug: id,
        },
        {
          slug: slug,
          name: data.name,
          description: data.description,
          image: data?.image ? data.image : null,
        },
      );
      if (newArtistDataUpdate) {
        return this.baseResponse.BaseResponseWithMessage('Success Updated');
      }
    }
  }

  async getListArtistAll(
    status: statusType,
    param?: IPaginationQueryParams,
  ): ReturnResponsePagination<IListArtistResponse[]> {
    this.setPaginationData({
      page: param.page,
      size: param.size,
    });
    const user: IGenerateJwtData = this.req['user'];

    const [data, count] = await this.artistRepository.findAndCount({
      where: {
        status:
          status === 'all' && user.role === UserRoleEnum.SUPER_ADMIN
            ? Not(StatusEnum.DRAFT)
            : parseTypeStatusToEnum(status),
        created_by:
          user.role === UserRoleEnum.ADMIN ? { id: user.id } : undefined,
        name: param?.search ? Like(`%${param.search}%`) : undefined,
      },
      relations: {
        created_by: true,
      },
      order: { updatedAt: 'DESC' },
      take: this.paginationSize,
      skip: this.paginationSkip,
    });

    const resData: IListArtistResponse[] = data.map((item) => {
      return {
        description: item.description,
        status_enum: item.status,
        status_string: parseEnumStatusToType(item.status),
        created_at: this.dateHelper.parseToUtc(item.createdAt),
        slug: item.slug,
        name: item.name,
        created_by: item.created_by.name,
        image: item?.image,
      };
    });
    return this.baseResponse.baseResponsePageable<IListArtistResponse[]>(
      resData,
      {
        page: this.paginationPage,
        size: this.paginationSize,
        total_data: count,
      },
    );
  }

  async getListArtistDraftUser(
    param?: IPaginationQueryParams,
  ): ReturnResponsePagination<IListArtistResponse[]> {
    this.setPaginationData({
      page: param.page,
      size: param.size,
    });
    const user: IGenerateJwtData = this.req['user'];
    const [data, count] = await this.artistRepository.findAndCount({
      where: {
        status: StatusEnum.DRAFT,
        created_by: { id: user.id },
        name: param?.search ? Like(`%${param.search}%`) : undefined,
      },
      relations: {
        created_by: true,
      },
      order: { updatedAt: 'DESC' },
      take: this.paginationSize,
      skip: this.paginationSkip,
    });
    const resData: IListArtistResponse[] = data.map((item) => {
      return {
        description: item.description,
        slug: item.slug,
        status_enum: item.status,
        status_string: parseEnumStatusToType(item.status),
        name: item.name,
        created_at: item.createdAt,
        created_by: item.created_by.name,
        image: item?.image,
      };
    });
    return this.baseResponse.baseResponsePageable<IListArtistResponse[]>(
      resData,
      {
        page: this.paginationPage,
        size: this.paginationSize,
        total_data: count,
      },
    );
  }

  async getDetailArtistById(
    slug: string,
  ): ReturnBaseResponse<IDetailArtistResponse> {
    const findArtist = await this.artistRepository.findOne({
      where: { slug: slug },
      relations: { created_by: true },
    });
    if (!findArtist) {
      throw new NotFoundException('Artist Tidak Ditemukan');
    } else {
      return this.baseResponse.BaseResponse<IDetailArtistResponse>({
        name: findArtist.name,
        slug: findArtist.slug,
        request_note: findArtist.notesRequest,
        status: findArtist.status,
        reject_revision_reason: findArtist.notesRevisionReject,
        description: findArtist.description,
        created_by: findArtist.created_by.name,
        image: findArtist.image ? findArtist.image : null,
        created_date: findArtist.createdAt,
        publish_date: findArtist.publishAt,
        reject_reason: findArtist?.rejectReason
          ? findArtist.rejectReason
          : null,
      });
    }
  }

  async deleteArtist(id: string): ReturnResponseWithMessage {
    const data = await this.artistRepository.findOneBy({ slug: id });
    if (!data) {
      throw new NotFoundException('Artist Not Found');
    } else {
      const deleted = await this.artistRepository.delete({ slug: id });
      if (deleted) {
        return this.baseResponse.BaseResponseWithMessage('Success Deleted');
      }
    }
  }

  async approvedArtistRequest(slug: string) {
    const findArtist = await this.artistRepository.findOneBy({
      slug,
      status: StatusEnum.PENDING,
    });
    const user: IGenerateJwtData = this.req['user'];

    if (!findArtist) {
      throw new NotFoundException('Artist tidak ditemukan');
    } else {
      const findUser = await this.userRepository.findOneBy({ id: user.id });
      const publishArtist = await this.artistRepository.update(
        { slug: slug },
        {
          status: StatusEnum.PUBLISH,
          approved_by: findUser,
          publishAt: new Date(),
        },
      );
      if (publishArtist) {
        return this.baseResponse.BaseResponseWithMessage('Artist Approved');
      }
    }
  }

  async needRevisionArtist(slug: string, data: IReqRejectReviseArtist) {
    const findData = await this.artistRepository.findOneBy({
      slug: slug,
      status: StatusEnum.PENDING,
    });
    if (!findData) {
      throw new NotFoundException('artist tidak di temukan');
    } else {
      const updatedData = await this.artistRepository.update(
        { slug },
        { status: StatusEnum.NEED_REVISION, notesRevisionReject: data.reason },
      );
      if (updatedData) {
        return this.baseResponse.BaseResponseWithMessage(
          'Revision Need Success',
        );
      }
    }
  }

  async getListArtistNeedRevision(
    param: IPaginationQueryParams,
  ): ReturnResponsePagination<IListArtistResponse[]> {
    const user: IGenerateJwtData = this.req['user'];
    this.setPaginationData({
      page: param.page,
      size: param.size,
    });
    const findUser = await this.userRepository.findOneBy({ id: user.id });
    const [data, count] = await this.artistRepository.findAndCount({
      where: {
        status: StatusEnum.NEED_REVISION,
        created_by: { id: findUser.id },
      },
      relations: { created_by: true },
    });
    if (data && findUser) {
      const dataList: IListArtistResponse[] = data.map((item) => {
        return {
          description: item.description,
          created_at: item.createdAt,
          slug: item.slug,
          status_enum: item.status,
          status_string: parseEnumStatusToType(item.status),
          name: item.name,
          created_by: item?.created_by?.name,
          image: item?.image,
        };
      });
      return this.baseResponse.baseResponsePageable<IListArtistResponse[]>(
        dataList,
        {
          size: this.paginationSize,
          total_data: count,
          page: this.paginationPage,
        },
      );
    }
  }

  async submitRevisionArtist(slug: string, data: ICreatedArtistDto) {
    const user: IGenerateJwtData = this.req['user'];
    const findData = await this.artistRepository.findOneBy({
      slug,
      status: StatusEnum.NEED_REVISION,
      created_by: { id: user.id },
    });
    if (!findData) {
      throw new NotFoundException('artist tidak ditemukan');
    } else {
      const submitData = await this.artistRepository.update(
        { slug },
        {
          name: data.name,
          status: StatusEnum.PENDING,
          description: data.description,
          notesRequest: data.notes,
          slug: this.generateSlug(data.name),
          image: data?.image ? data.image : null,
        },
      );
      if (submitData) {
        return this.baseResponse.BaseResponseWithMessage(
          'Request Revision Success',
        );
      }
    }
  }

  async rejectArtist(body: IReqRejectReviseArtist, slug: string) {
    const checkArtist = await this.artistRepository.findOne({
      where: {
        slug: slug,
        status: StatusEnum.PENDING,
      },
    });
    if (!checkArtist) {
      throw new NotFoundException('Artist Not Found');
    } else {
      const updateData = await this.artistRepository.update(
        { id: checkArtist.id },
        {
          status: StatusEnum.REJECT,
          rejectReason: body.reason,
        },
      );
      if (updateData) {
        return this.baseResponse.BaseResponseWithMessage('Reject Success');
      }
    }
  }

  async getListAllArtistSelect() {
    const data = await this.artistRepository.find({
      where: {
        status: StatusEnum.PUBLISH,
      },
      order: {
        name: 'ASC',
      },
    });
    if (data) {
      const resData: IResListArtistSelect[] = data.map((item) => {
        return {
          slug: item.slug,
          name: item.name,
          id: item.id,
        };
      });
      return this.baseResponse.BaseResponse<IResListArtistSelect[]>(resData);
    }
  }
}
