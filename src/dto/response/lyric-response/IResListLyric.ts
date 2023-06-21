import { StatusEnum } from '../../../enum/status-enum';

export interface IResListLyric {
  id?: number;
  title: string;
  slug: string;
  created_at: Date;
  publish_by?: string;
  status_enum: StatusEnum;
  status_string: string;
  image?: string;
  artis_name: string;
  artis_slug: string;
  created_by: string;
}
