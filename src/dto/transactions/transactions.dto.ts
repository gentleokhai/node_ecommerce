import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Validate,
  IsOptional,
  IsArray,
} from 'class-validator';
import { IsValidMongoId } from '../general';
import { CreateTransaction, Item, RefundTransaction } from './types';

export class CreateTransactionValidationSchema implements CreateTransaction {
  @IsString()
  @IsOptional()
  @Validate(IsValidMongoId)
  customerId!: string | undefined;

  @IsArray()
  @IsNotEmpty()
  items!: Item[];

  @IsString()
  @IsNotEmpty()
  methodOfPayment!: string;

  @IsString()
  @IsNotEmpty()
  cashierId!: string;

  @IsString()
  @IsNotEmpty()
  typeOfTransaction!: 'SALE' | 'REFUND';
}

export class CreateRefundTransactionValidationSchema
  implements RefundTransaction
{
  @IsArray()
  @IsNotEmpty()
  items!: Item[];

  @IsString()
  @IsNotEmpty()
  typeOfTransaction!: 'SALE' | 'REFUND';
}
