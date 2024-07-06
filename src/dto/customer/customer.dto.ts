import {
  IsString,
  IsPhoneNumber,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
  Validate,
} from 'class-validator';
import { Gender, IsEnumValue, IsValidMongoId } from '../general';
import { CreateCustomerInput, UpdateCustomerInput } from './types';

export class CreateCustomerValidationSchema implements CreateCustomerInput {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsOptional()
  @ValidateIf((o) => o.phoneNumber !== '')
  @IsPhoneNumber()
  phoneNumber!: string;

  @IsString()
  @IsOptional()
  firstName!: string;

  @IsString()
  @IsOptional()
  lastName!: string;

  @IsString()
  @IsOptional()
  @IsEnumValue(Gender)
  gender!: string;

  @IsString()
  @IsOptional()
  @Validate(IsValidMongoId)
  group!: string;
}

export class UpdateCustomerValidationSchema
  extends CreateCustomerValidationSchema
  implements UpdateCustomerInput
{
  @IsEmail()
  @IsOptional()
  email!: string;
}
