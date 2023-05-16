import { LyricsStatusEnum } from '@enum/lyrics-status-enum';

export interface IDetailLyricResponse {
  id?: number;
  title: string;
  slug: string;
  description: string;
  lyric: string;
  created_by: string;
  created_at: Date;
  publish_by?: string;
  status: LyricsStatusEnum;
  artis_name: string;
  artis_slug: string;
  categories: ICategories[];
}

interface ICategories {
  name: string;
  slug: string;
}
