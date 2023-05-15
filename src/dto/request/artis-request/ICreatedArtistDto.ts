import { IsNotEmpty } from 'class-validator';

export class ICreatedArtistDto {
  @IsNotEmpty()
  name: string;
  description?: string;
}
