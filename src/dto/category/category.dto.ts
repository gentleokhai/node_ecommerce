import { IsString, IsNotEmpty } from 'class-validator';
import { CreateCategory } from './types';

export class CreateCategoryValidationSchema implements CreateCategory {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
