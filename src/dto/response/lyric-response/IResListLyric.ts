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

export interface IResListLyricV2 {
  id?: number;
  title: string;
  slug: string;
  created_at: Date;
  publish_by?: string;
  status_enum: StatusEnum;
  status_string: string;
  image?: string;
  artist_name: string;
  artist_slug: string;
  created_by: string;
  publish_at: Date;
  total_view: number;
  total_like: number;
  total_comment: number;
}
