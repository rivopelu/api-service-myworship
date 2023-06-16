import { UserRoleEnum } from '@enum/user-role-enum';

export interface IResGetMeDataUser {
  name: string;
  username: string;
  role: UserRoleEnum;
  image: string;
}
