export interface IResDetailLyricWeb {
  image: string;
  title: string;
  slug: string;
  artist_name: string;
  artist_slug: string;
  artist_image: string;
  categories: ICategories[];
  published_date: Date;
  total_lyric_artist: number;
  description: string;
  lyric: string;
}

interface ICategories {
  slug: string;
  name: string;
}
