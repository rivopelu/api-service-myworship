import { IsNotEmpty, IsNumber } from 'class-validator';

export class IReqCommentLyrics {
  @IsNotEmpty()
  lyrics_slug: string;
  @IsNotEmpty()
  comment: string;
}
