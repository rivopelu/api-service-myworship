import { IsNotEmpty } from 'class-validator';

export class INeedRevisionRequestDto {
  @IsNotEmpty()
  notes: string;
}