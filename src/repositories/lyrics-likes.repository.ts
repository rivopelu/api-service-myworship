import { DataSource, Repository } from 'typeorm';
import { LyricsLikes } from '../entities/LyricsLikes';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LyricsLikesRepository extends Repository<LyricsLikes> {
  constructor(private dataSource: DataSource) {
    super(LyricsLikes, dataSource.createEntityManager());
  }
}
