import { IsNotEmpty } from 'class-validator';

export class IReqRejectReviseArtist {
  @IsNotEmpty()
  reason: string;
}
