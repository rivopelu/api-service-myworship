import { IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

export class ICreatedArtistDto {
  @ApiProperty({
    name: 'name',
  })
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    name: 'description',
  })
  description?: string;
  @ApiProperty({
    name: 'notes',
  })
  notes?: string;
}
