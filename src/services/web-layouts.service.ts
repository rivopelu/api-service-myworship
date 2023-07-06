import { Inject, Injectable } from '@nestjs/common';
import BaseService from './_base.service';

import { ReturnBaseResponse } from '../config/base-response-config';
import { IResLayoutsGetHomeContent } from '../dto/response/layouts-response/IResLayoutsGetHomeContent';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { Not, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Lyrics } from '../entities/Lyrics';
import { Artist } from '../entities/Artist';
import { StatusEnum } from '../enum/status-enum';
import { UserRoleEnum } from '../enum/user-role-enum';
import { Categories } from '../entities/Categories';
import { QueryBuilders } from '../utils/query-builders';

@Injectable()
export class WebLayoutsService extends BaseService {
  private queryBuilder = new QueryBuilders();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
    @InjectRepository(Lyrics)
    private lyricsRepository: Repository<Lyrics>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    private jwtService: JwtService,
    @Inject(REQUEST)
    private req: Request,
  ) {
    super();
  }

  async getHomeContent(): ReturnBaseResponse<IResLayoutsGetHomeContent> {
    const getCountArtist = await this.artistRepository.count({
      where: {
        status: StatusEnum.PUBLISH,
      },
    });
    const getCountLyric = await this.lyricsRepository.count({
      where: {
        status: StatusEnum.PUBLISH,
      },
    });
    const getContributor = await this.userRepository.count({
      where: {
        role: Not(UserRoleEnum.USER),
      },
    });
    const getTopCategories = await this.queryBuilder.getTopCategoriesQuery(
      this.categoriesRepository,
    );
    const getTopArtist = await this.queryBuilder.getTopArtistWithLyricsCount(
      this.artistRepository,
    );

    if (getCountLyric && getCountArtist && getContributor && getTopCategories) {
      const res: IResLayoutsGetHomeContent = {
        title: 'MY WORSHIP',
        subTitle:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the standard dummy text ever since the 1500s, when an unknown printer took a galley\n',
        total_contributor: getContributor,
        total_publish_artist: getCountArtist,
        total_publish_lyric: getCountLyric,
        top_categories: getTopCategories.map((item) => {
          return {
            slug: item.slug,
            name: item.name,
            total_lyrics: parseInt(item.total_lyrics.toString()),
          };
        }),
        top_artist: getTopArtist.map((item) => {
          return {
            ...item,
            total_artist_view: parseInt(item.total_artist_view.toString()),
            total_lyrics: parseInt(item.total_lyrics.toString()),
          };
        }),
      };
      return this.baseResponse.BaseResponse<IResLayoutsGetHomeContent>(res);
    }
  }
}
