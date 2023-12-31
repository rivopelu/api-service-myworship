import { BadRequestException, Injectable } from '@nestjs/common';
import BaseService from './_base.service';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from '../entities/Artist';
import { StatusEnum } from '../enum/status-enum';
import { Lyrics } from '../entities/Lyrics';
import { IResDetailArtistWeb } from '../dto/response/artist-response/IResDetailArtistWeb';

@Injectable()
export class WebArtistService extends BaseService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    @InjectRepository(Lyrics)
    private lyricsRepository: Repository<Lyrics>,
  ) {
    super();
  }

  async getDetailArtistBySlug(slug: string) {
    if (!slug) {
      throw new BadRequestException('Slug Required');
    }
    const data = await this.artistRepository.findOne({
      where: {
        slug: slug,
        status: StatusEnum.PUBLISH,
      },
    });

    if (data) {
      const [topLyric, count] = await this.lyricsRepository.findAndCount({
        where: {
          artist: {
            id: data.id,
          },
          status: StatusEnum.PUBLISH,
        },
        take: 3,
        order: {
          view: 'DESC',
        },
      });
      if (topLyric) {
        await this.artistRepository.update(
          { slug: data.slug },
          {
            view: parseInt(data.view.toString()) + 1,
          },
        );

        const dataRes: IResDetailArtistWeb = {
          name: data.name,
          image: data.image,
          slug: data.slug,
          description: data.description,
          total_view: parseInt(data.view.toString()),
          total_lyric: count,
          publish_date: data.publishAt,
          top_lyric: topLyric.map((item) => {
            return {
              slug: item.slug,
              title: item.title,
              image: item.image,
              view: parseInt(item.view.toString()),
            };
          }),
        };
        return this.baseResponse.BaseResponse<IResDetailArtistWeb>(dataRes);
      }
    }
  }
}
