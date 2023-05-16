import { LyricsStatusEnum } from '@enum/lyrics-status-enum';

export interface IResListLyric {
  id?: number;
  title: string;
  slug: string;
  created_at: Date;
  publish_by?: string;
  status: LyricsStatusEnum;
  artis_name: string;
  artis_slug: string;
}
