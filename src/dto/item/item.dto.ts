import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Validate,
  IsOptional,
  IsInt,
  Min,
  IsArray,
} from 'class-validator';
import { IsValidMongoId } from '../general';
import { Item } from '../transactions';
import {
  CreateItem,
  RestockPayload,
  UpdateItem,
  UpdateItemPrice,
  UpdateItemStock,
} from './types';

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

export class UpdateItemValidationSchema implements UpdateItem {
  @IsString()
  @IsOptional()
  image!: string;

  @IsString()
  @IsOptional()
  name!: string;

  @IsString()
  @IsOptional()
  @Validate(IsValidMongoId)
  category!: string;

  @IsString()
  @IsOptional()
  unit!: string;

  @IsString()
  @IsOptional()
  sku!: string;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @IsOptional()
  weight!: number;

  @IsString()
  @IsOptional()
  description!: string;
}

export class UpdateItemPriceValidationSchema implements UpdateItemPrice {
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @IsOptional()
  costPrice!: number;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @IsOptional()
  sellingPrice!: number;
}

export class UpdateItemStockValidationSchema implements UpdateItemStock {
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 0,
  })
  @IsInt({ message: 'stock must be a whole number.' })
  @IsOptional()
  stock!: number;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 0,
  })
  @IsInt({ message: 'low stock must be a whole number.' })
  @IsOptional()
  lowStock!: number;
}

export class RestockItemStockValidationSchema implements RestockPayload {
  @IsArray()
  @IsNotEmpty()
  items!: Item[];
}
