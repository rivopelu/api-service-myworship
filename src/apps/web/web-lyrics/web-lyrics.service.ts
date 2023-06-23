import { Injectable } from '@nestjs/common';
import BaseService from '../../base-service';
import { InjectRepository } from '@nestjs/typeorm';
import { Lyrics } from '../../../entities/Lyrics';
import { Like, Repository } from 'typeorm';
import { IResSearchLyric } from '../../../dto/response/lyric-response/IResSearchLyric';
import { StatusEnum } from '../../../enum/status-enum';

@Injectable()
export class WebLyricsService extends BaseService {
  constructor(
    @InjectRepository(Lyrics)
    private lyricsRepository: Repository<Lyrics>,
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
}
