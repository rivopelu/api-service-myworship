import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import IRegisterDto from '../../../dto/request/auth-request/IRegisterDto';

import BaseService from '../../base-service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import ILoginDto from '../../../dto/request/auth-request/ILoginDto';
import { UtilsHelper } from '../../../helper/utils-helper';
import { User } from '../../../entities/User';
import { UserRoleEnum } from '../../../enum/user-role-enum';
import { ISuccessLoginResponse } from '../../../dto/response/auth-response/ISuccessLoginResponse';
import {
  ReturnBaseResponse,
  ReturnResponseWithMessage,
} from '../../../config/base-response-config';

@Injectable()
export class CmsAuthService extends BaseService {
  private utilsHelper: UtilsHelper = new UtilsHelper(this.jwtService);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService?: JwtService,
  ) {
    super();
  }

  async register(data: IRegisterDto): ReturnResponseWithMessage {
    const checkEmail = await this.userRepository.findOneBy({
      email: data.email,
    });
    const checkUsername = await this.userRepository.findOneBy({
      username: data.username,
    });

    if (checkEmail) {
      throw new BadRequestException('Email Telah digunakan');
    } else if (checkUsername) {
      throw new BadRequestException('Username telah digunakan');
    } else {
      const hashPassword = await this.utilsHelper.encryptPassword(
        data.password,
      );
      if (hashPassword) {
        const newDataUser = await this.userRepository.save({
          username: data.username,
          email: data.email,
          name: data.name,
          password: hashPassword,
        });
        if (newDataUser) {
          return this.baseResponse.BaseResponseWithMessage('SUCCESS');
        }
      }
    }
  }

  async loginWithGoogle(token: string) {
    const dataResGoogle = await this.utilsHelper.getDataFromGoogle(token);
    if (dataResGoogle.data) {
      const findEmail = await this.userRepository.findOneBy({
        email: dataResGoogle.data.email,
      });
      if (findEmail) {
        if (
          findEmail.role === UserRoleEnum.USER ||
          findEmail.role === UserRoleEnum.SUPER_ADMIN
        ) {
          const token = this.utilsHelper.generateJwt({
            email: findEmail.email,
            username: findEmail.username,
            name: findEmail.name,
            id: findEmail.id,
            role: findEmail.role,
          });
          return this.baseResponse.BaseResponse<ISuccessLoginResponse>({
            access_token: token,
          });
        } else {
          throw new BadRequestException('Login Failed');
        }
      } else {
        throw new BadRequestException('Login Failed');
      }
    }
  }

  async login(data: ILoginDto): ReturnBaseResponse<ISuccessLoginResponse> {
    const findUser = await this.userRepository.findOneBy({ email: data.email });
    if (!findUser) {
      throw new NotFoundException('email tidak ditemukan');
    } else {
      if (
        findUser.role === UserRoleEnum.ADMIN ||
        findUser.role === UserRoleEnum.SUPER_ADMIN
      ) {
        const comparePassword = await this.utilsHelper.comparePassword(
          data.password,
          findUser.password,
        );
        if (!comparePassword) {
          throw new BadRequestException('Login Failed');
        } else {
          const token = this.utilsHelper.generateJwt({
            email: findUser.email,
            username: findUser.username,
            name: findUser.name,
            id: findUser.id,
            role: findUser.role,
          });
          return this.baseResponse.BaseResponse<ISuccessLoginResponse>({
            access_token: token,
          });
        }
      } else {
        throw new BadRequestException('Login Failed');
      }
    }
  }
}
