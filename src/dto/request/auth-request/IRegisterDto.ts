import { IsNotEmpty } from 'class-validator';

export default class IRegisterDto {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}
