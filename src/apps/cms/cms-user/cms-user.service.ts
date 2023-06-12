import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@entities/User';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import BaseService from '@apps/base-service';
import { IGenerateJwtData } from '@utils/utils-interfaces-type';
import { ReturnBaseResponse } from '@config/base-response-config';
import { IResGetMeDataUser } from '@dto/response/user-response/IResGetMeDataUser';

@Injectable()
export class CmsUserService extends BaseService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
      const dataRes: IResGetMeDataUser = {
        name: findData.name,
        image: findData.image,
        role: findData.role,
        username: findData.username,
      };
      return this.baseResponse.BaseResponse<IResGetMeDataUser>(dataRes);
    }
  }
}
