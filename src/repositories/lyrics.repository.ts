import { DataSource, Repository } from 'typeorm';
import { Lyrics } from '../entities/Lyrics';
import { Injectable } from '@nestjs/common';
import { StatusEnum } from '../enum/status-enum';
import { IResListLyricsWebGeneral } from '../dto/response/lyric-response/IResListLyricsWebGeneral';
import { IReqQueryParams } from '../utils/utils-interfaces-type';
import { IResListLyricV2 } from '../dto/response/lyric-response/IResListLyric';
import { TextHelper } from '../helper/text-helper';

@Injectable()
export class LyricsRepository extends Repository<Lyrics> {
  private textHelper = new TextHelper();

  constructor(private dataSource: DataSource) {
    super(Lyrics, dataSource.createEntityManager());
  }

  async findTopLyricsList(): Promise<IResListLyricsWebGeneral[]> {
    return this.createQueryBuilder('lyrics')
      .leftJoinAndSelect('lyrics.artist', 'artist')
      .leftJoinAndSelect('lyrics.comments', 'comments')
      .leftJoinAndSelect('lyrics.likes', 'likes')
      .select([
        'lyrics.slug AS slug',
        'lyrics.title AS title',
        'lyrics.image AS image',
        'lyrics.view AS total_view',
        'artist.name AS artist_name',
        'artist.slug',
        'COUNT(DISTINCT comments.id) AS total_comment',
        'COUNT(DISTINCT likes.id) AS total_like',
      ])
      .where('lyrics.status = :status', { status: StatusEnum.PUBLISH })
      .groupBy('lyrics.id, artist.id')
      .orderBy('lyrics.view', 'DESC')
      .limit(5)
      .getRawMany();
  }

  async findTopLyricsListByArtist(
    artistSlug: string,
  ): Promise<IResListLyricsWebGeneral[]> {
    return this.createQueryBuilder('lyrics')
      .leftJoinAndSelect('lyrics.artist', 'artist')
      .leftJoinAndSelect('lyrics.comments', 'comments')
      .leftJoinAndSelect('lyrics.likes', 'likes')
      .select([
        'lyrics.slug AS slug',
        'lyrics.title AS title',
        'lyrics.image AS image',
        'lyrics.view AS total_view',
        'artist.name AS artist_name',
        'artist.slug',
        'COUNT(DISTINCT comments.id) AS total_comment',
        'COUNT(DISTINCT likes.id) AS total_like',
      ])
      .where('lyrics.status = :status', { status: StatusEnum.PUBLISH })
      .where('artist.slug = :slug', { slug: artistSlug })
      .groupBy('lyrics.id, artist.id')
      .orderBy('lyrics.view', 'DESC')
      .limit(5)
      .getRawMany();
  }

  async findListLyricsPagination(
    param: IReqQueryParams,
  ): Promise<IResListLyricsWebGeneral[]> {
    return this.createQueryBuilder('lyrics')
      .leftJoinAndSelect('lyrics.artist', 'artist')
      .leftJoinAndSelect('lyrics.comments', 'comments')
      .leftJoinAndSelect('lyrics.likes', 'likes')
      .select([
        'lyrics.slug AS slug',
        'lyrics.title AS title',
        'lyrics.image AS image',
        'lyrics.view AS total_view',
        'artist.name AS artist_name',
        'artist.slug',
        'COUNT(DISTINCT comments.id) AS total_comment',
        'COUNT(DISTINCT likes.id) AS total_like',
      ])
      .groupBy('lyrics.id, artist.id')
      .orderBy('lyrics.view', 'DESC')
      .offset(param.page)
      .limit(param.size)
      .getRawMany();
  }

  public async findListLyricCmsAndCount(
    param: IReqQueryParams,
    status?: StatusEnum,
  ): Promise<IResListLyricV2[]> {
    const query = this.createQueryBuilder('lyrics')
      .leftJoinAndSelect('lyrics.created_by', 'created_by')
      .leftJoinAndSelect('lyrics.approved_by', 'publish_by')
      .leftJoinAndSelect('lyrics.comments', 'comments')
      .leftJoinAndSelect('lyrics.likes', 'likes')
      .leftJoinAndSelect('lyrics.artist', 'artist')
      .leftJoinAndSelect('lyrics.categories', 'categories')
      .select([
        'lyrics.id AS id',
        'lyrics.title AS title',
        'lyrics.slug AS slug',
        'lyrics.createdAt AS created_at',
        'created_by.name AS created_by',
        'publish_by.name AS publish_by',
        'lyrics.status AS status_enum',
        'lyrics.status AS status_string',
        'lyrics.image AS image',
        'artist.name AS artist_name',
        'artist.slug',
        'lyrics.published_at AS publish_at',
        'lyrics.view AS total_view',
        'COUNT(DISTINCT comments.id) AS total_comment',
        'COUNT(DISTINCT likes.id) AS total_like',
      ])
      .groupBy('lyrics.id, artist.id')
      .orderBy('lyrics.created_at', 'DESC')
      .offset(param.page)
      .limit(param.size);

    if (status) {
      query.where('lyrics.status = :status');
      query.setParameter('status', status);
    }
    if (param.search) {
      query.andWhere('lyrics.title LIKE :search');
      query.setParameter('search', `%${param.search}%`);
    }

    if (param.categories) {
      const categoryIds = this.textHelper.parseSeparateCommaToArrayNumber(
        param.categories,
      );
      console.log(categoryIds);
      query.andWhere(
        categoryIds.length > 0 ? 'categories.id IN (:...categoryIds)' : '1=1',
      );
      query.setParameter('categoryIds', categoryIds);
    }
    return query.getRawMany();
  }
}
