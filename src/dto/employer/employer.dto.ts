import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Gender, IsEnumValue } from '../general';
import { UpdateEmployerInput } from './types';

export class UpdateEmployerValidationSchema implements UpdateEmployerInput {
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
