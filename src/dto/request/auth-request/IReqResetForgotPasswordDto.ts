import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class IReqResetForgotPasswordDto {
  @ApiProperty({ name: 'password', type: 'string' })
  @IsNotEmpty()
  password: string;
  @ApiProperty({ name: 'token', type: 'string' })
  @IsNotEmpty()
  token: string;
}
