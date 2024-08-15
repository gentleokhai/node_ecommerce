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
  @Validate(IsValidMongoId)
  company!: string;

  @IsString()
  @IsNotEmpty()
  @IsEnumValue(AccessType)
  accessType!: AccessType;

  @IsString()
  @IsNotEmpty()
  @IsEnumValue(Gender)
  gender!: Gender;
}

export class UpdateEmployeeValidationSchema implements UpdateEmployeeInput {
  @IsEmail()
  @IsOptional()
  email!: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber!: string;

  @IsString()
  @IsOptional()
  firstName!: string;

  @IsString()
  @IsOptional()
  lastName!: string;

  @IsString()
  @IsOptional()
  @Validate(IsValidMongoId)
  jobTitle!: string;

  @IsString()
  @IsOptional()
  dateOfEmployment!: string;

  @IsString()
  @IsOptional()
  @Validate(IsValidMongoId)
  company!: string;

  @IsString()
  @IsOptional()
  @IsEnumValue(Gender)
  gender!: Gender;
}

export class UpdateEmployeeAccessValidationSchema
  implements UpdateEmployeeAccessInput
{
  @IsString()
  @IsNotEmpty()
  @IsEnumValue(AccessType)
  accessType!: AccessType;
}

export class UpdateEmployeeStatusSchema implements UpdateEmployeeStatusInput {
  @IsString()
  @IsNotEmpty()
  @IsEnumValue(Status)
  status!: Status;
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
  gender!: Gender;
}
