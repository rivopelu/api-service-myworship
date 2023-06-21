import { StatusEnum } from '../../../enum/status-enum';

export interface IListArtistResponse {
  name: string;
  slug: string;
  description?: string;
  created_by?: string;
  status_enum: StatusEnum;
  status_string: string;
  created_at: Date;
  image?: string;
}
