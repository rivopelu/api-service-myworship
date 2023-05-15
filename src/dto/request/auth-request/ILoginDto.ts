import { IsNotEmpty } from 'class-validator';

export default class ILoginDto {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}
