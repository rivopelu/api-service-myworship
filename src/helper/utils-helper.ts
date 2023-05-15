import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import axios, { AxiosResponse } from 'axios';
import { BadRequestException } from '@nestjs/common';
import { ENV } from '../constants/ENV';
import { faker } from '@faker-js/faker';

import {
  IGenerateJwtData,
  IResponseGoogle,
} from '../utils/utils-interfaces-type';

export class UtilsHelper {
  constructor(private jwtService?: JwtService) {}

  public async encryptPassword(pw: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(pw, saltOrRounds);
  }

  public generateJwt(data: IGenerateJwtData) {
    return this.jwtService.sign(data);
  }

  public generateOTP(length = 6): string {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  }

  async getDataFromGoogle(token: string) {
    try {
      const dataResGoogle: AxiosResponse<IResponseGoogle> = await axios.get(
        ENV.GOOGLE_API,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (dataResGoogle) {
        return dataResGoogle;
      }
    } catch (e) {
      throw new BadRequestException(
        'Terjadi kesalahan saat memuat data google',
      );
    }
  }

  public async comparePassword(pw: string, compare: string): Promise<boolean> {
    return await bcrypt.compare(pw, compare);
  }

  public generateRandomPassword() {
    return faker.internet.password(8);
  }
}
