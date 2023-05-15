import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@entities/User';
import { Like, Repository } from 'typeorm';
import BaseService from '@apps/base-service';
import { Artist } from '@entities/Artist';
import {
  ReturnBaseResponse,
  ReturnResponsePagination,
  ReturnResponseWithMessage,
} from '@config/base-response-config';
import { ICreatedArtistDto } from '@dto/request/artis-request/ICreatedArtistDto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import {
  IGenerateJwtData,
  IPaginationQueryParams,
} from '@utils/utils-interfaces-type';
import { IListArtistResponse } from '@dto/request/response/artist-response/IListArtistResponse';
import { IDetailArtistResponse } from '@dto/request/response/artist-response/IDetailArtistResponse';
import { ArtistStatusEnum } from '@enum/artist-status-enum';
import { UserRoleEnum } from '@enum/user-role-enum';

@Injectable()
export class CmsArtisService extends BaseService {
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
            status: ArtistStatusEnum.PENDING,
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
            status: ArtistStatusEnum.DRAFT,
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
        },
      );
      if (newArtistDataUpdate) {
        return this.baseResponse.BaseResponseWithMessage('Success Updated');
      }
    }
  }

  async getListArtistAll(
    param?: IPaginationQueryParams,
  ): ReturnResponsePagination<IListArtistResponse[]> {
    this.setPaginationData({
      page: param.page,
      size: param.size,
    });
    const user: IGenerateJwtData = this.req['user'];

    const [data, count] = await this.artistRepository.findAndCount({
      where: {
        created_by:
          user.role === UserRoleEnum.ADMIN ? { id: user.id } : undefined,
        name: param?.search ? Like(`%${param.search}%`) : undefined,
      },
      relations: {
        created_by: true,
      },
      order: { createdAt: 'DESC' },
      take: this.paginationSize,
      skip: this.paginationSkip,
    });
    const resData: IListArtistResponse[] = data.map((item) => {
      return {
        description: item.description,
        status: item.status,
        created_at: item.createdAt,
        slug: item.slug,
        name: item.name,
        created_by: item.created_by.name,
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
        status: ArtistStatusEnum.DRAFT,
        created_by: { id: user.id },
        name: param?.search ? Like(`%${param.search}%`) : undefined,
      },
      relations: {
        created_by: true,
      },
      order: { createdAt: 'DESC' },
      take: this.paginationSize,
      skip: this.paginationSkip,
    });
    const resData: IListArtistResponse[] = data.map((item) => {
      return {
        description: item.description,
        slug: item.slug,
        status: item.status,
        name: item.name,
        created_at: item.createdAt,
        created_by: item.created_by.name,
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
    id: string,
  ): ReturnBaseResponse<IDetailArtistResponse> {
    const findArtist = await this.artistRepository.findOne({
      where: { slug: id },
      relations: { created_by: true },
    });
    if (!findArtist) {
      throw new NotFoundException('Artist Tidak Ditemukan');
    } else {
      return this.baseResponse.BaseResponse<IDetailArtistResponse>({
        name: findArtist.name,
        slug: findArtist.slug,
        description: findArtist.description,
        created_by: findArtist.created_by.name,
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
      status: ArtistStatusEnum.PENDING,
    });
    const user: IGenerateJwtData = this.req['user'];

    if (!findArtist) {
      throw new NotFoundException('Artist tidak ditemukan');
    } else {
      const findUser = await this.userRepository.findOneBy({ id: user.id });
      const publishArtist = await this.artistRepository.update(
        { slug: slug },
        { status: ArtistStatusEnum.PUBLISH, approved_by: findUser },
      );
      if (publishArtist) {
        return this.baseResponse.BaseResponseWithMessage('Artist Approved');
      }
    }
  }
}
