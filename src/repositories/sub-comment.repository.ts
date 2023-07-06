import { DataSource, Repository } from 'typeorm';
import { SubComment } from '../entities/SubComment';
import { Injectable } from '@nestjs/common';
@Injectable()
export class SubCommentRepository extends Repository<SubComment> {
  constructor(private dataSource: DataSource) {
    super(SubComment, dataSource.createEntityManager());
  }
}
