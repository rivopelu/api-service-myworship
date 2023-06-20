import { StatusEnum } from '@enum/status-enum';

export interface IDetailArtistResponse {
  name: string;
  slug: string;
  description?: string;
  created_by?: string;
  image: string;
  request_note: string;
  reject_revision_reason: string;
  status: StatusEnum;
  reject_reason: string;
  created_date: Date;
  publish_date: Date;
}
