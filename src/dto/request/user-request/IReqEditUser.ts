import { IsNotEmpty } from 'class-validator';

export class IReqEditUser {
  image: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  username: string;
  phone_number: string;
}
