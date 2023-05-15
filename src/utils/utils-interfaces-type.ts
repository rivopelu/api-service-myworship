import { UserRoleEnum } from '../enum/user-role-enum';

export interface ILabelValue<T> {
  label: string;
  value: T;
}

export interface IPaginationQueryParams {
  size?: number;
  page?: number;
  search?: string;
}

export interface setDataPageable {
  page: number;
  size: number;
  total_data: number;
}

export interface IGenerateJwtData {
  email: string;
  name: string;
  id: string;
  username: string;
  role: UserRoleEnum;
}

export interface IResponseGoogle {
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
  hd: string;
}
