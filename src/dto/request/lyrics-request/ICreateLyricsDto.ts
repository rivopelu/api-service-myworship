import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Artist } from '../../../entities/Artist';

export class ICreateLyricsDto {
  @ApiProperty({ name: 'title' })
  @IsNotEmpty()
  title: string;
  @ApiProperty({ name: 'description' })
  description: string;
  @ApiProperty({ name: 'notes' })
  notes: string;
  @ApiProperty({ name: 'lyrics' })
  @IsNotEmpty()
  lyric: string;
  @IsNotEmpty()
  @ApiProperty({ type: Artist })
  artist_slug: string;
  @IsNotEmpty()
  @ApiProperty({ name: 'categories id' })
  categories_id: number[];
  image?: string;
  @IsNotEmpty()
  youtube_url: string;
}
