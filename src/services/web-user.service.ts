import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IReqEditUser } from '../dto/request/user-request/IReqEditUser';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { Not, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import BaseService from './_base.service';

@Injectable()
export class WebUserService extends BaseService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(REQUEST)
    private readonly req: Request,
  ) {
    super();
  }

  async editUser(body: IReqEditUser) {
    const findUser = await this.userRepository.findOneBy({
      id: this.req['user'].id,
    });
    if (findUser) {
      const checkUsernameUpdate = await this.userRepository.findOneBy({
        username: body.username,
        id: Not(findUser.id),
      });
      const checkEmailUpdate = await this.userRepository.findOneBy({
        email: body.email,
        id: Not(findUser.id),
      });
      if (checkEmailUpdate && findUser.email !== checkEmailUpdate.email) {
        throw new BadRequestException('email already exist');
      } else if (
        checkUsernameUpdate &&
        findUser.username !== checkUsernameUpdate.username
      ) {
        throw new BadRequestException('username already exist');
      } else {
        const updateUser = await this.userRepository.update(
          { id: findUser.id },
          {
            name: body.name,
            email: body.email,
            image: body.image,
            username: body.username,
            phoneNumber: body.phone_number ?? null,
            isVerifiedEmail: body.email === findUser.email,
          },
        );
        if (updateUser) {
          return this.baseResponse.BaseResponseWithMessage(
            'User Success Updated',
          );
        }
      }
    }
  }
}
