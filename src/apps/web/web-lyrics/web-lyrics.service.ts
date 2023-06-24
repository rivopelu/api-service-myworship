import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import BaseService from '../../base-service';
import { InjectRepository } from '@nestjs/typeorm';
import { Lyrics } from '../../../entities/Lyrics';
import { Like, Repository } from 'typeorm';
import { IResSearchLyric } from '../../../dto/response/lyric-response/IResSearchLyric';
import { StatusEnum } from '../../../enum/status-enum';
import { IResDetailLyricWeb } from '../../../dto/response/lyric-response/IResDetailLyricWeb';
import { Artist } from '../../../entities/Artist';
import { DateHelper } from '../../../helper/date-helper';

@Injectable()
export class WebLyricsService extends BaseService {
  private dateHelper = new DateHelper();

  constructor(
    @InjectRepository(Lyrics)
    private lyricsRepository: Repository<Lyrics>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {
    super();
  }

  async getSearchLyricByName(title: string) {
    if (!title) {
      return this.baseResponse.BaseResponse<IResSearchLyric[]>([]);
    } else {
      const lyricData = await this.lyricsRepository.find({
        where: {
          status: StatusEnum.PUBLISH,
          title: Like(`%${title}%`),
        },
        relations: {
          artist: true,
        },
        order: {
          title: 'DESC',
        },
        take: 10,
      });
      if (lyricData) {
        const dataRes: IResSearchLyric[] = lyricData.map((item) => {
          return {
            artist_slug: item.artist.slug,
            title: item.title,
            slug: item.slug,
            artist: item.artist.name,
            image: item.image,
          };
        });
        return this.baseResponse.BaseResponse<IResSearchLyric[]>(dataRes);
      }
    }
  }

  async getDetailLyricBySlugWeb(slug: string) {
    if (!slug) {
      throw new BadRequestException('Slug Required');
    }
    const data = await this.lyricsRepository.findOne({
      where: {
        slug: slug,
        status: StatusEnum.PUBLISH,
      },
      relations: {
        categories: true,
        artist: true,
      },
    });
    if (!data) {
      throw new NotFoundException('Lyric Not Found');
    } else {
      const getCountDataArtist = await this.lyricsRepository.countBy({
        artist: {
          id: data.artist.id,
        },
        status: StatusEnum.PUBLISH,
      });
      const dataRes: IResDetailLyricWeb = {
        title: data.title,
        slug: data.slug,
        image: data.image,
        total_lyric_artist: getCountDataArtist,
        artist_image: data.artist.image,
        published_date: this.dateHelper.parseToUtc(data.publishAt),
        artist_slug: data.artist.slug,
        artist_name: data.artist.name,
        description: data.description,
        lyric: data.lyric,
        categories: data.categories.map((item) => {
          return {
            slug: item.slug,
            name: item.name,
          };
        }),
      };
      return this.baseResponse.BaseResponse<IResDetailLyricWeb>(dataRes);
    }
  }
}
