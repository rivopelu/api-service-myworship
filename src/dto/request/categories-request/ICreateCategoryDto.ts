import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ICreateCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  description: string;
}
