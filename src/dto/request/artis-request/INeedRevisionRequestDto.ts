import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class INeedRevisionRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  notes: string;
}
