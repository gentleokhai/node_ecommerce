import { CreateCompanyInput } from '../dto/company/types';
import { Company } from '../models';

export const createCompany = (data: CreateCompanyInput) => {
  const {
    businessName,
    businessType,
    industry,
    companySize,
    addressNumber,
    buyingCurrency,
    sellingCurrency,
    street,
    city,
    state,
    zipCode,
  } = data;

  const createdCompany = Company.create({
    businessName,
    businessType,
    industry,
    companySize,
    addressNumber,
    buyingCurrency,
    sellingCurrency,
    street,
    city,
    state,
    zipCode,
  });

  return createdCompany;
};
