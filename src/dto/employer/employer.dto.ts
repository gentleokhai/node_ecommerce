import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
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
  @IsOptional()
  role!: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  gender!: string;
}
