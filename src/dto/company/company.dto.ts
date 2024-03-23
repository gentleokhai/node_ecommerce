import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateCompanyInput } from './types';

export class CreateCompanyValidationSchema implements CreateCompanyInput {
  @IsString()
  @IsNotEmpty()
  businessName!: string;

  @IsString()
  @IsNotEmpty()
  businessType!: string;

  @IsString()
  @IsNotEmpty()
  industry!: string;

  @IsString()
  @IsNotEmpty()
  companySize!: string;

  @IsString()
  @IsNotEmpty()
  addressNumber!: string;

  @IsString()
  @IsNotEmpty()
  buyingCurrency!: string;

  @IsString()
  @IsNotEmpty()
  sellingCurrency!: string;

  @IsString()
  @IsOptional()
  street!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsString()
  @IsNotEmpty()
  zipCode!: string;
}
