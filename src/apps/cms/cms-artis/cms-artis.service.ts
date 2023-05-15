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
import { find } from 'rxjs';
import { IListArtistResponse } from '@dto/request/response/artist-response/IListArtistResponse';
import { IDetailArtistResponse } from '@dto/request/response/artist-response/IDetailArtistResponse';

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
          });
          if (newArtis) {
            return this.baseResponse.BaseResponseWithMessage('SUCCESS');
          }
        }
      }
    }
  }

  async updatedArtis(id: string, data: ICreatedArtistDto) {
    const findArtist = await this.artistRepository.findOneBy({ id: id });
    if (!findArtist) {
      throw new NotFoundException('Artist Not Found');
    } else {
      const slug = this.generateSlug(data.name);
      const newArtistDataUpdate = await this.artistRepository.update(
        {
          id: id,
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

  async getListArtist(
    param?: IPaginationQueryParams,
  ): ReturnResponsePagination<IListArtistResponse[]> {
    this.setPaginationData({
      page: param.page,
      size: param.size,
    });

    const [data, count] = await this.artistRepository.findAndCount({
      where: {
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
        name: item.name,
        id: item.id,
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
      where: { id },
      relations: { created_by: true },
    });
    if (!findArtist) {
      throw new NotFoundException('Artist Tidak Ditemukan');
    } else {
      return this.baseResponse.BaseResponse<IDetailArtistResponse>({
        name: findArtist.name,
        slug: findArtist.slug,
        id: findArtist.id,
        description: findArtist.description,
        created_by: findArtist.created_by.name,
      });
    }
  }

  async deleteArtist(id: string): ReturnResponseWithMessage {
    const data = await this.artistRepository.findOneBy({ id });
    if (!data) {
      throw new NotFoundException('Artist Not Found');
    } else {
      const deleted = await this.artistRepository.delete({ id: id });
      if (deleted) {
        return this.baseResponse.BaseResponseWithMessage('Success Deleted');
      }
    }
  }
}
