import { Repository, SelectQueryBuilder } from 'typeorm';
import { Categories } from '../entities/Categories';
import {
  ITopArtistHomeContent,
  ITopCategoriesHomeContent,
} from '../dto/response/layouts-response/IResLayoutsGetHomeContent';
import { StatusEnum } from '../enum/status-enum';
import { Artist } from '../entities/Artist';

export class QueryBuilders {
  public async getTopCategoriesQuery(
    repository: Repository<Categories>,
  ): Promise<ITopCategoriesHomeContent[]> {
    const queryBuilderTopCategories: SelectQueryBuilder<Categories> =
      repository.createQueryBuilder('category');
    queryBuilderTopCategories
      .leftJoin('category.lyrics', 'lyrics')
      .select('category.slug', 'slug')
      .addSelect('category.name', 'name')
      .addSelect('COUNT(lyrics.id)', 'total_lyrics')
      .where('lyrics.status = :status', { status: StatusEnum.PUBLISH })
      .groupBy('category.slug, category.name')
      .orderBy('COUNT(lyrics.id)', 'DESC')
      .limit(6);

    return await queryBuilderTopCategories.getRawMany();
  }

  public async getTopArtistWithLyricsCount(
    repository: Repository<Artist>,
  ): Promise<ITopArtistHomeContent[]> {
    return await repository
      .createQueryBuilder('artist')
      .leftJoinAndSelect('artist.lyrics', 'lyrics')
      .where('artist.status = :status', { status: StatusEnum.PUBLISH })
      .orderBy('lyrics.view', 'DESC')
      .select('artist.slug', 'artist_slug')
      .addSelect('artist.name', 'artist_name')
      .addSelect('artist.image', 'artist_image')
      .addSelect('artist.view', 'total_artist_view')
      .addSelect('COUNT(lyrics.id)', 'total_lyrics')
      .groupBy('artist.id')
      .where('lyrics.status = :status', { status: StatusEnum.PUBLISH })
      .orderBy('artist.view', 'DESC')
      .limit(6)
      .getRawMany();
  }
}
