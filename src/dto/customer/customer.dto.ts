import {
  IsString,
  IsPhoneNumber,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { Gender, IsEnumValue } from '../general';
import { CreateCustomerInput } from './types';

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
}
