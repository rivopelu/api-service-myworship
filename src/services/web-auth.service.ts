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
import BaseService from './_base.service';

import { UtilsHelper } from '../helper/utils-helper';
import IRegisterDto from '../dto/request/auth-request/IRegisterDto';
import { User } from '../entities/User';
import ILoginDto, { ILoginGoogle } from '../dto/request/auth-request/ILoginDto';

import { ISuccessLoginResponse } from '../dto/response/auth-response/ISuccessLoginResponse';
import { ReturnBaseResponse } from '../config/base-response-config';
import { IResGetMeDataUser } from '../dto/response/user-response/IResGetMeDataUser';
import { IGenerateJwtData } from '../utils/utils-interfaces-type';
import { REQUEST } from '@nestjs/core';
import { faker } from '@faker-js/faker';
import { UserRoleEnum } from '../enum/user-role-enum';
import { MailService } from '../mail/mail.service';
import IReqResetForgotPasswordDto from '../dto/request/auth-request/IReqResetForgotPasswordDto';
import { Request } from 'express';
import { getClientInfo } from '../utils/getClientInfo';
import { LyricsLikes } from '../entities/LyricsLikes';

@Injectable()
export class WebAuthService extends BaseService {
  private utilsHelper: UtilsHelper = new UtilsHelper(this.jwtService);

  constructor(
    private mailService: MailService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(LyricsLikes)
    private lyricsLikesRepository: Repository<LyricsLikes>,
    private jwtService: JwtService,
    @Inject(REQUEST)
    private req: Request,
  ) {
    super();
  }

  private async sendVerificationEmail(user: User) {
    return await this.mailService
      .sendVerification(user.email, user.name, user.emailVerificationToken)
      .then(() => {
        return true;
      });
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
        const generateTokenVerified = this.utilsHelper.generateJwt({
          email: faker.internet.email(),
          role: UserRoleEnum.USER,
          name: faker.person.fullName() + new Date().getTime(),
          id: new Date().getTime(),
          username: faker.person.fullName() + new Date().getTime(),
        });
        const newDataUser = await this.userRepository.save({
          username: body.username,
          email: body.email,
          name: body.name,
          password: hashPassword,
          emailVerificationToken: generateTokenVerified,
        });
        if (newDataUser) {
          const sendVerification = await this.sendVerificationEmail(
            newDataUser,
          );
          if (sendVerification) {
            return this.baseResponse.BaseResponseWithMessage('SUCCESS');
          }
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
        role: findData.role,
        phone_number: findData?.phoneNumber ?? null,
        username: findData.username,
        is_verified_email: findData.isVerifiedEmail,
        lyrics_likes: findLike.map((item) => item.lyrics.slug),
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
          const generateTokenVerified = this.utilsHelper.generateJwt({
            email: faker.internet.email(),
            role: UserRoleEnum.USER,
            name: faker.person.fullName() + new Date().getTime(),
            id: new Date().getTime(),
            username: faker.person.fullName() + new Date().getTime(),
          });
          const newDataUser = await this.userRepository.save({
            username: data.username,
            name: dataResGoogle.data.name,
            role: UserRoleEnum.USER,
            image: dataResGoogle.data.picture,
            email: dataResGoogle.data.email,
            password: hashPw,
            emailVerificationToken: generateTokenVerified,
          });
          if (newDataUser) {
            const sendEmail = await this.sendVerificationEmail(newDataUser);
            if (sendEmail) {
              return this.baseResponse.BaseResponseWithMessage(
                'Register Success',
              );
            }
          }
        }
      }
    }
  }

  async verifyEmail(token: string) {
    if (!token) {
      throw new BadRequestException('Token Required');
    }
    const findUser = await this.userRepository.findOne({
      where: {
        emailVerificationToken: token,
      },
    });
    if (!findUser) {
      throw new NotFoundException('User Not Found');
    } else {
      const updateUser = await this.userRepository.update(
        { id: findUser.id },
        {
          emailVerificationToken: null,
          isVerifiedEmail: true,
        },
      );
      if (updateUser) {
        return this.baseResponse.BaseResponseWithMessage(
          'Verification Success',
        );
      }
    }
  }

  async sendForgotPasswordEmail(email: string) {
    if (!email) {
      throw new BadRequestException('Email Is Required');
    }
    const findData = await this.userRepository.findOneBy({ email: email });
    if (!findData) {
      throw new NotFoundException(
        'Email is not yet registered on my worship platform',
      );
    } else {
      const generateTokenVerified = this.utilsHelper.generateJwt({
        email: faker.internet.email(),
        role: UserRoleEnum.USER,
        name: faker.person.fullName() + new Date().getTime(),
        id: new Date().getTime(),
        username: faker.person.fullName() + new Date().getTime(),
      });
      const updateData = await this.userRepository.update(
        {
          id: findData.id,
        },
        {
          forgotPasswordToken: generateTokenVerified,
        },
      );
      if (updateData) {
        const sendEmail = await this.mailService
          .sendEmailForgotPassword({
            email: findData.email,
            name: findData.name,
            token: generateTokenVerified,
          })
          .then(() => {
            return true;
          });
        if (sendEmail) {
          return this.baseResponse.BaseResponseWithMessage(
            'Send Email Reset Password Success',
          );
        }
      }
    }
  }

  async resendVerificationEmail(email: string) {
    if (!email) {
      throw new BadRequestException('Email Required');
    }
    const findData = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!findData) {
      throw new NotFoundException('User Not Found');
    } else {
      if (findData.isVerifiedEmail) {
        throw new BadRequestException('Your email has been verified');
      } else {
        const generateTokenVerified = this.utilsHelper.generateJwt({
          email: faker.internet.email(),
          role: UserRoleEnum.USER,
          name: faker.person.fullName() + new Date().getTime(),
          id: new Date().getTime(),
          username: faker.person.fullName() + new Date().getTime(),
        });
        const updateData = await this.userRepository.update(
          {
            id: findData.id,
          },
          {
            emailVerificationToken: generateTokenVerified,
          },
        );
        if (updateData) {
          const getAgainUser = await this.userRepository.findOne({
            where: {
              id: findData.id,
            },
          });
          if (getAgainUser) {
            const sendEMail = await this.sendVerificationEmail(getAgainUser);
            if (sendEMail) {
              return this.baseResponse.BaseResponseWithMessage(
                'Resend Verification Success',
              );
            }
          }
        }
      }
    }
  }

  async resetPassword(body: IReqResetForgotPasswordDto) {
    const findData = await this.userRepository.findOne({
      where: {
        forgotPasswordToken: body.token,
      },
    });
    if (!findData) {
      throw new NotFoundException('User Not Found');
    } else {
      const hashPassword = await this.utilsHelper.encryptPassword(
        body.password,
      );
      if (hashPassword) {
        const updateData = await this.userRepository.update(
          {
            id: findData.id,
          },
          {
            password: hashPassword,
            forgotPasswordToken: null,
          },
        );
        if (updateData) {
          return this.baseResponse.BaseResponseWithMessage(
            'password Updated Success',
          );
        }
      }
    }
  }
}
