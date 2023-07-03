export interface IResDetailLyricWeb {
  image: string;
  title: string;
  slug: string;
  artist_name: string;
  artist_slug: string;
  artist_image: string;
  youtube_url: string;
  view: number;
  like: number;
  categories: ICategories[];
  published_date: Date;
  total_lyric_artist: number;
  description: string;
  lyric: string;
  other_artist_lyrics: OtherLyric[];
  other_lyrics: OtherLyric[];
}

interface ICategories {
  slug: string;
  name: string;
}

interface OtherLyric {
  title: string;
  image: string;
  slug: string;
  artist_name: string;
  artist_slug: string;
  view: number;
  youtube_url: string;
}
