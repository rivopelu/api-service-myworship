import { DataSource, Repository } from 'typeorm';
import { Artist } from '../entities/Artist';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ArtistRepository extends Repository<Artist> {
  constructor(private dataSource: DataSource) {
    super(Artist, dataSource.createEntityManager());
  }
}
