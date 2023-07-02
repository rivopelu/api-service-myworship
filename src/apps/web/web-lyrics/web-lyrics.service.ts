import {
  BadRequestException,
  Inject,
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
import { IPaginationQueryParams } from '../../../utils/utils-interfaces-type';
import { IResLyricPaginationByArtistWeb } from '../../../dto/response/lyric-response/IResLyricPaginationByArtistWeb';
import { ReturnResponsePagination } from '../../../config/base-response-config';
import { IReqCommentLyrics } from '../../../dto/request/lyrics-request/IReqCommentLyrics';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { User } from '../../../entities/User';
import { LyricsComment } from '../../../entities/LyricsComment';
import { IReqAddSubLyricComment } from '../../../dto/request/lyrics-request/IReqAddSubLyricComment';
import { SubLyricsComment } from '../../../entities/SubLyricsComment';
import {
  IResCommentData,
  IResCommentLyrics,
} from '../../../dto/response/lyric-response/IResCommentLyrics';

@Injectable()
export class WebLyricsService extends BaseService {
  private dateHelper = new DateHelper();

  constructor(
    @InjectRepository(Lyrics)
    private lyricsRepository: Repository<Lyrics>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(LyricsComment)
    private lyricsCommentRepository: Repository<LyricsComment>,
    @InjectRepository(SubLyricsComment)
    private subLyricsCommentRepository: Repository<SubLyricsComment>,
    @Inject(REQUEST) private readonly req: Request,
  ) {
    super();
  }

  async getSearchLyricByName(title: string) {
    if (!title) {
      return this.baseResponse.BaseResponse<IResSearchLyric[]>([]);
    } else {
      const lyrics = await this.lyricsRepository.find({
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
        take: 5,
      });

      const artist = await this.lyricsRepository.find({
        where: {
          status: StatusEnum.PUBLISH,
          artist: {
            name: Like(`%${title}%`),
          },
        },
        relations: {
          artist: true,
        },
        order: {
          title: 'DESC',
        },
        take: 5,
      });

      if (lyrics && artist) {
        const lyricData = [...lyrics, ...artist];
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

      const getOtherSongFromArtist = await this.lyricsRepository.find({
        where: {
          status: StatusEnum.PUBLISH,
          artist: {
            id: data.artist.id,
          },
        },
        take: 5,
      });
      await this.lyricsRepository.update(
        {
          id: data.id,
        },
        {
          view: parseInt(data.view.toString()) + 1,
        },
      );
      await this.artistRepository.update(
        {
          id: data.artist.id,
        },
        {
          view: parseInt(data.artist.view.toString()) + 1,
        },
      );
      const getOtherSong = await this.lyricsRepository.find({
        where: {
          status: StatusEnum.PUBLISH,
        },
        relations: {
          artist: true,
        },
        take: 5,
        order: {
          view: 'DESC',
        },
      });

      const dataRes: IResDetailLyricWeb = {
        title: data.title,
        slug: data.slug,
        youtube_url: data.youtubeUrl,
        image: data.image,
        view: parseInt(data.view.toString()),
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
        other_lyrics: getOtherSong.map((item) => {
          return {
            youtube_url: item.youtubeUrl,
            slug: item.slug,
            title: item.title,
            image: item.image,
            artist_name: item.artist.name,
            artist_slug: item.artist.slug,
            view: parseInt(item.view.toString()),
          };
        }),
        other_artist_lyrics: getOtherSongFromArtist.map((item) => {
          return {
            slug: item.slug,
            youtube_url: item.youtubeUrl,
            title: item.title,
            image: item.image,
            artist_name: data.artist.name,
            artist_slug: data.artist.slug,
            view: parseInt(item.view.toString()),
          };
        }),
      };
      return this.baseResponse.BaseResponse<IResDetailLyricWeb>(dataRes);
    }
  }

  public async getListPaginationByArtistSlug(
    artistSlug: string,
    param: IPaginationQueryParams,
  ): ReturnResponsePagination<IResLyricPaginationByArtistWeb[]> {
    this.setPaginationData({
      page: param.page,
      size: param.size ?? 9,
    });
    const artist = await this.artistRepository.findOne({
      where: {
        slug: artistSlug,
      },
    });
    if (!artist) {
      throw new NotFoundException('Artist Not Found');
    } else {
      const [data, count] = await this.lyricsRepository.findAndCount({
        where: {
          status: StatusEnum.PUBLISH,
          artist: {
            id: artist.id,
          },
        },
        relations: {
          artist: true,
        },
        order: { publishAt: 'DESC' },
        take: this.paginationSize,
        skip: this.paginationSkip,
      });
      if (data) {
        const listData: IResLyricPaginationByArtistWeb[] = data.map((item) => {
          return {
            slug: item.slug,
            title: item.title,
            image: item.image,
            artist_name: item.artist.name,
            artist_slug: item.artist.slug,
            view: parseInt(item.view.toString()),
          };
        });
        return this.baseResponse.baseResponsePageable<
          IResLyricPaginationByArtistWeb[]
        >(listData, {
          page: this.paginationPage,
          size: this.paginationSize,
          total_data: count,
        });
      }
    }
  }

  async addCommentLyrics(body: IReqCommentLyrics) {
    const userId = this.req['user'].id;
    const findUser = await this.userRepository.findOneBy({ id: userId });
    const findLyrics = await this.lyricsRepository.findOneBy({
      slug: body.lyrics_slug,
    });
    if (!findUser) {
      throw new BadRequestException('User Not Found');
    } else if (!findLyrics) {
      throw new BadRequestException('Lyrics Not Found');
    } else {
      const addComment = await this.lyricsCommentRepository.save({
        lyrics: findLyrics,
        comment_by: findUser,
        comment: body.comment,
      });
      if (addComment) {
        return this.baseResponse.BaseResponseWithMessage('Comment Success');
      }
    }
  }

  async addSubCommentLyrics(body: IReqAddSubLyricComment) {
    const userId = this.req['user'].id;
    const findUser = await this.userRepository.findOneBy({ id: userId });
    const findParent = await this.lyricsCommentRepository.findOneBy({
      id: body.parent_id,
    });
    if (!findUser) {
      throw new BadRequestException('User Not Found');
    } else if (!findParent) {
      throw new BadRequestException('Lyrics Not Found');
    } else {
      const addComment = await this.subLyricsCommentRepository.save({
        parentComment: findParent,
        comment_by: findUser,
        comment: body.comment,
      });
      if (addComment) {
        return this.baseResponse.BaseResponseWithMessage('Comment Success');
      }
    }
  }

  async getCommentLyrics(slug: string) {
    if (!slug) {
      throw new BadRequestException('Slug Required');
    }
    const [findComment, count] =
      await this.lyricsCommentRepository.findAndCount({
        where: {
          lyrics: {
            slug: slug,
          },
        },
        relations: {
          subComment: {
            comment_by: true,
          },
          comment_by: true,
        },
        order: {
          createdAt: 'DESC',
          subComment: {
            createdAt: 'DESC',
          },
        },
        take: 5,
      });
    if (findComment) {
      const resData: IResCommentData[] = findComment.map((item) => {
        return {
          comment: item.comment,
          comment_by_image: item.comment_by.image,
          comment_by_username: item.comment_by.username,
          created_at: this.dateHelper.parseToUtc(item.createdAt),
          id: item.id,
          sub_comment: item.subComment.map((sub) => {
            return {
              comment: sub.comment,
              comment_by_username: sub.comment_by.username,
              comment_by_image: sub.comment_by.image,
              created_at: this.dateHelper.parseToUtc(sub.createdAt),
              id: sub.id,
            };
          }),
        };
      });
      return this.baseResponse.BaseResponse<IResCommentLyrics>({
        is_show_other_comment: count - 5 === 1,
        total_previous_comment: count - 5 <= 0 ? 0 : count - 5,
        total_data: count,
        comment: resData,
      });
    }
  }
}
