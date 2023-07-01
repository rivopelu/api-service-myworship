export interface IResDetailArtistWeb {
  name: string;
  slug: string;
  total_lyric: number;
  description: string;
  image: string;
  publish_date: Date;
  top_lyric: ILyrics[];
  total_view: number;
}

interface ILyrics {
  title: string;
  view: number;
  slug: string;
  image: string;
}
