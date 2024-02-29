import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateCompanyInput } from './types';

export class CreateCompanyValidationSchema implements CreateCompanyInput {
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsString()
  @IsNotEmpty()
  businessType: string;

  @IsString()
  @IsNotEmpty()
  industry: string;

  @IsString()
  @IsNotEmpty()
  companySize: string;

  @IsString()
  @IsNotEmpty()
  addressNumber: string;

  @IsString()
  @IsNotEmpty()
  buyingCurrency: string;

  @IsString()
  @IsNotEmpty()
  sellingCurrency: string;

  @IsString()
  @IsOptional()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  constructor(
    businessName: string,
    businessType: string,
    industry: string,
    companySize: string,
    addressNumber: string,
    buyingCurrency: string,
    sellingCurrency: string,
    street: string,
    city: string,
    state: string,
    zipCode: string
  ) {
    this.businessName = businessName;
    this.businessType = businessType;
    this.industry = industry;
    this.companySize = companySize;
    this.addressNumber = addressNumber;
    this.buyingCurrency = buyingCurrency;
    this.sellingCurrency = sellingCurrency;
    this.street = street;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
  }
}
