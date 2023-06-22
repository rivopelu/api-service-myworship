import {
  BadRequestException,
  Injectable,
  NotFoundException,
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

@Injectable()
export class WebAuthService extends BaseService {
  private utilsHelper: UtilsHelper = new UtilsHelper(this.jwtService);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService?: JwtService,
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
}
