import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import BaseService from '../../base-service';
import { UtilsHelper } from '../../../helper/utils-helper';
import IRegisterDto from '../../../dto/request/auth-request/IRegisterDto';
import { User } from '../../../entities/User';
import ILoginDto, {
  ILoginGoogle,
} from '../../../dto/request/auth-request/ILoginDto';

import { ISuccessLoginResponse } from '../../../dto/response/auth-response/ISuccessLoginResponse';
import { ReturnBaseResponse } from '../../../config/base-response-config';
import { IResGetMeDataUser } from '../../../dto/response/user-response/IResGetMeDataUser';
import { IGenerateJwtData } from '../../../utils/utils-interfaces-type';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { faker } from '@faker-js/faker';
import { UserRoleEnum } from '../../../enum/user-role-enum';

@Injectable()
export class WebAuthService extends BaseService {
  private utilsHelper: UtilsHelper = new UtilsHelper(this.jwtService);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject(REQUEST)
    private req: Request,
  ) {
    super();
  }

  async register(body: IRegisterDto) {
    const checkEmail = await this.userRepository.findOneBy({
      email: body.email,
    });
    const checkUsername = await this.userRepository.findOneBy({
      username: body.username,
    });

    if (checkEmail) {
      throw new BadRequestException('Email Telah digunakan');
    } else if (checkUsername) {
      throw new BadRequestException('Username telah digunakan');
    } else {
      const hashPassword = await this.utilsHelper.encryptPassword(
        body.password,
      );
      if (hashPassword) {
        const newDataUser = await this.userRepository.save({
          username: body.username,
          email: body.email,
          name: body.name,
          password: hashPassword,
        });
        if (newDataUser) {
          return this.baseResponse.BaseResponseWithMessage('SUCCESS');
        }
      }
    }
  }

  async login(data: ILoginDto) {
    const findUser = await this.userRepository.findOneBy({ email: data.email });
    if (!findUser) {
      throw new NotFoundException('email tidak ditemukan');
    } else {
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
    }
  }

  async loginGoogle(data: ILoginGoogle) {
    const dataResGoogle = await this.utilsHelper.getDataFromGoogle(data.token);
    if (dataResGoogle.data) {
      const findEmail = await this.userRepository.findOneBy({
        email: dataResGoogle.data.email,
      });
      if (findEmail) {
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
    }
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

  async registerWithGoogle(token: string) {
    const data = new User();
    const dataResGoogle = await this.utilsHelper.getDataFromGoogle(token);
    if (dataResGoogle.data) {
      const findEmail = await this.userRepository.findOneBy({
        email: dataResGoogle.data.email,
      });
      const findUsername = await this.userRepository.findOne({
        where: {
          username: this.utilsHelper.generateSlug(dataResGoogle.data.name),
        },
      });
      data.username = this.utilsHelper.generateSlug(dataResGoogle.data.name);
      if (findEmail) {
        throw new BadRequestException('Email Already Exist');
      } else {
        const hashPw = await this.utilsHelper.encryptPassword(
          faker.internet.password(),
        );
        if (findUsername) {
          data.username =
            this.utilsHelper.generateSlug(dataResGoogle.data.name) +
            '-' +
            new Date().getTime();
        }
        if (hashPw) {
          const newDataUser = await this.userRepository.save({
            username: data.username,
            name: dataResGoogle.data.name,
            role: UserRoleEnum.USER,
            image: dataResGoogle.data.picture,
            email: dataResGoogle.data.email,
            password: hashPw,
          });
          if (newDataUser) {
            return this.baseResponse.BaseResponseWithMessage(
              'Register Success',
            );
          }
        }
      }
    }
  }
}
