import { IsNotEmpty, IsNumber } from 'class-validator';

export class IReqAddSubLyricComment {
  @IsNotEmpty()
  @IsNumber()
  parent_id: number;
  @IsNotEmpty()
  comment: string;
}
