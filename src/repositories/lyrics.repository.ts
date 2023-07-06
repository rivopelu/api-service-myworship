import { DataSource, Repository } from 'typeorm';
import { Lyrics } from '../entities/Lyrics';
import { Injectable } from '@nestjs/common';
import { StatusEnum } from '../enum/status-enum';
import { IResListLyricsWebGeneral } from '../dto/response/lyric-response/IResListLyricsWebGeneral';
import { IPaginationQueryParams } from '../utils/utils-interfaces-type';

@Injectable()
export class LyricsRepository extends Repository<Lyrics> {
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
    param: IPaginationQueryParams,
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
      .groupBy('lyrics.id, artist.id')
      .orderBy('lyrics.view', 'DESC')
      .offset(param.page)
      .limit(param.size)
      .getRawMany();
  }
}
