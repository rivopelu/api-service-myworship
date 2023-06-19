import { StatusEnum } from '@enum/status-enum';

export interface IDetailLyricResponse {
  id?: number;
  title: string;
  slug: string;
  description: string;
  lyric: string;
  created_by: string;
  created_at: Date;
  publish_by?: string;
  status_enum: StatusEnum;
  status_string: string;
  artis_name: string;
  artis_slug: string;
  image: string;
  request_notes: string;
  categories: ICategories[];
}

interface ICategories {
  name: string;
  slug: string;
}
