import { UserRoleEnum } from '../../../enum/user-role-enum';

export interface IResGetListUser {
  name: string;
  username: string;
  email: string;
  role: UserRoleEnum;
  image: string;
  created_at: Date;
}
