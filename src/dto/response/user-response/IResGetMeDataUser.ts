import { UserRoleEnum } from '../../../enum/user-role-enum';

export interface IResGetMeDataUser {
  name: string;
  username: string;
  role: UserRoleEnum;
  image: string;
  email: string;
  is_verified_email: boolean;
  phone_number: string | null;
  lyrics_likes: string[];
}
