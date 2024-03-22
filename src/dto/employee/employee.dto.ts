import {
  IsString,
  IsPhoneNumber,
  IsEmail,
  IsNotEmpty,
  Validate,
  IsOptional,
} from 'class-validator';
import { IsValidMongoId } from '../general';
import { CreateEmployeeInput } from './types';

export class CreateEmployeeValidationSchema implements CreateEmployeeInput {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  jobTitle!: string;

  @IsString()
  @IsNotEmpty()
  dateOfEmployment!: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsValidMongoId)
  company!: string;

  @IsString()
  @IsNotEmpty()
  role!: string;

  @IsString()
  @IsNotEmpty()
  gender!: string;
}

export class UpdateEmployeeValidationSchema implements CreateEmployeeInput {
  @IsEmail()
  @IsOptional()
  @IsNotEmpty()
  email!: string;

  @IsPhoneNumber()
  @IsOptional()
  @IsNotEmpty()
  phoneNumber!: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  jobTitle!: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  dateOfEmployment!: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Validate(IsValidMongoId)
  company!: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  role!: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  gender!: string;
}
