import { CreateCompanyInput } from '../dto/company/types';
import { Company } from '../models';

export const createCompany = (data: CreateCompanyInput) => {
  const createdCompany = Company.create(data);

  return createdCompany;
};
