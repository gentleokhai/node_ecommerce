import {
  IsString,
  IsPhoneNumber,
  IsEmail,
  IsNotEmpty,
  Validate,
  IsOptional,
} from 'class-validator';
import {
  AccessType,
  Gender,
  IsEnumValue,
  IsValidMongoId,
  Status,
} from '../general';
import {
  CreateEmployeeInput,
  UpdateEmployeeStatusInput,
  UpdateEmployeeAccessInput,
  UpdateEmployeeInput,
  UpdateEmployeeOnboardingInput,
} from './types';

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
  @Validate(IsValidMongoId)
  jobTitle!: string;

  @IsString()
  @IsNotEmpty()
  dateOfEmployment!: string;

  @IsString()
  @IsNotEmpty()
  @IsEnumValue(Status)
  status!: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsValidMongoId)
  company!: string;

  @IsString()
  @IsNotEmpty()
  @IsEnumValue(AccessType)
  accessType!: string;

  @IsString()
  @IsNotEmpty()
  @IsEnumValue(Gender)
  gender!: string;
}

export class UpdateEmployeeValidationSchema implements UpdateEmployeeInput {
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
  @Validate(IsValidMongoId)
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
  @IsEnumValue(Gender)
  gender!: string;
}

export class UpdateEmployeeAccessValidationSchema
  implements UpdateEmployeeAccessInput
{
  @IsString()
  @IsNotEmpty()
  @IsEnumValue(AccessType)
  accessType!: string;
}

export class UpdateEmployeeStatusSchema implements UpdateEmployeeStatusInput {
  @IsString()
  @IsNotEmpty()
  @IsEnumValue(Status)
  status!: string;
}

export class UpdateEmployeeOnboardingValidationSchema
  implements UpdateEmployeeOnboardingInput
{
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  @IsEnumValue(Gender)
  gender!: string;
}
