import { IsNotEmpty } from 'class-validator';

export class ICreateCategoryDto {
  @IsNotEmpty()
  name: string;
  description: string;
}
