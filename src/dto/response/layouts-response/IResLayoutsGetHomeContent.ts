import { Artist } from '../../../entities/Artist';

export interface IResLayoutsGetHomeContent {
  title: string;
  subTitle: string;
  total_publish_lyric: number;
  total_publish_artist: number;
  total_contributor: number;
  top_categories: ITopCategoriesHomeContent[];
  top_artist: ITopArtistHomeContent[];
}

export interface ITopCategoriesHomeContent {
  total_lyrics: number;
  slug: string;
  name: string;
}

export interface ITopArtistHomeContent {
  artist_name: string;
  artist_slug: string;
  total_lyrics: number;
  total_artist_view: number;
  artist_image: string;
}
