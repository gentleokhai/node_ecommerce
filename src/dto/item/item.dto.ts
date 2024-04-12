import {
  IsString,
  IsNotEmpty,
  IsMimeType,
  Validate,
  IsOptional,
} from 'class-validator';
import { IsValidMongoId } from '../general';
import { CreateItem } from './types';

export class CreateItemValidationSchema implements CreateItem {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsValidMongoId)
  category!: string;

  @IsString()
  @IsNotEmpty()
  unit!: string;

  @IsString()
  @IsNotEmpty()
  sku!: string;

  @IsString()
  @IsNotEmpty()
  weight!: string;

  @IsString()
  @IsNotEmpty()
  currency!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  costPrice!: string;

  @IsString()
  @IsNotEmpty()
  sellingPrice!: string;

  @IsString()
  @IsOptional()
  wholesalePrice!: string;

  @IsString()
  @IsOptional()
  quantityInPack!: string;

  @IsString()
  @IsNotEmpty()
  stock!: string;

  @IsString()
  @IsNotEmpty()
  lowStock!: string;
}
