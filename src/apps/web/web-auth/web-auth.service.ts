import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import BaseService from '../../base-service';
import { UtilsHelper } from '../../../helper/utils-helper';
import IRegisterDto from '../../../dto/request/auth-request/IRegisterDto';
import { User } from '../../../entities/User';

@Injectable()
export class WebAuthService extends BaseService {
  private utilsHelper: UtilsHelper = new UtilsHelper();

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
}
