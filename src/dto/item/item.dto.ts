import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Validate,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { IsValidMongoId } from '../general';
import { CreateItem } from './types';

export class CreateItemValidationSchema implements CreateItem {
  @IsString()
  @IsNotEmpty()
  image!: string;

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

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @IsOptional()
  weight!: number | null;

  @IsString()
  @IsNotEmpty()
  currency!: string;

  @IsString()
  @IsOptional()
  description!: string;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @Min(1)
  @IsNotEmpty()
  costPrice!: number;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @Min(1)
  @IsNotEmpty()
  sellingPrice!: number;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @Min(1)
  @IsOptional()
  wholesalePrice!: number | null;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 0,
  })
  @IsInt({ message: 'quantity in pack must be a whole number.' })
  @IsOptional()
  quantityInPack!: number | null;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 0,
  })
  @IsInt({ message: 'stock must be a whole number.' })
  @IsNotEmpty()
  stock!: number;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 0,
  })
  @IsInt({ message: 'low stock must be a whole number.' })
  @IsNotEmpty()
  lowStock!: number;
}
