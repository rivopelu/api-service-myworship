import { IsNotEmpty } from 'class-validator';

export class IReqRejectRevisionLyric {
  @IsNotEmpty()
  reason: string;
}
