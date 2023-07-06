import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { User } from '../entities/User';
import { IResGetMeDataUser } from '../dto/response/user-response/IResGetMeDataUser';
import {
  ReturnBaseResponse,
  ReturnResponsePagination,
} from '../config/base-response-config';
import {
  IGenerateJwtData,
  IPaginationQueryParams,
} from '../utils/utils-interfaces-type';
import { parseTypeRoleToEnum, roleUserType } from '../utils/status-type';
import { IResGetListUser } from '../dto/response/user-response/IResGetListUser';
import BaseService from './_base.service';

import { LyricsLikes } from '../entities/LyricsLikes';

@Injectable()
export class CmsUserService extends BaseService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(LyricsLikes)
    private lyricsLikesRepository: Repository<LyricsLikes>,
    @Inject(REQUEST) private readonly req: Request,
  ) {
    super();
  }

  async getMeData(): ReturnBaseResponse<IResGetMeDataUser> {
    const user: IGenerateJwtData = this.req['user'];
    const findData = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!findData) {
      throw new UnauthorizedException();
    } else {
      const findLike = await this.lyricsLikesRepository.find({
        where: { user: { id: findData.id } },
        relations: {
          user: true,
          lyrics: true,
        },
      });
      const dataRes: IResGetMeDataUser = {
        name: findData.name,
        email: findData.email,
        image: findData.image,
        phone_number: findData?.phoneNumber ?? null,
        role: findData.role,
        username: findData.username,
        is_verified_email: findData.isVerifiedEmail,
        lyrics_likes: findLike.map((item) => item.lyrics.slug),
      };
      return this.baseResponse.BaseResponse<IResGetMeDataUser>(dataRes);
    }
  }

  async getLisUser(
    role: roleUserType,
    param?: IPaginationQueryParams,
  ): ReturnResponsePagination<IResGetListUser[]> {
    this.setPaginationData({
      page: param.page,
      size: param.size,
    });
    const [data, count] = await this.userRepository.findAndCount({
      where: {
        role: parseTypeRoleToEnum(role),
        name: param?.search ? Like(`%${param.search}%`) : undefined,
      },
      order: { updatedAt: 'DESC' },
      take: this.paginationSize,
      skip: this.paginationSkip,
    });
    const resData: IResGetListUser[] = data.map((item) => {
      return {
        name: item.name,
        image: item?.image ? item.image : null,
        role: item.role,
        username: item.username,
        email: item.email,
        created_at: item.createdAt,
      };
    });
    return this.baseResponse.baseResponsePageable<IResGetListUser[]>(resData, {
      page: this.paginationPage,
      size: this.paginationSize,
      total_data: count,
    });
  }
}
