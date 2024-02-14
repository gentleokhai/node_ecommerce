import { Request, Response, NextFunction } from 'express';
import { CreateCompanyInput } from '../dto/company/types';
import { Company } from '../models';

export const createCompany = (data: CreateCompanyInput) => {
  const {
    businessName,
    businessType,
    industry,
    employeeRange,
    streetNumber,
    address,
    city,
    state,
    zipCode,
  } = data;

  const createdCompany = Company.create({
    businessName,
    businessType,
    industry,
    employeeRange,
    streetNumber,
    address,
    city,
    state,
    zipCode,
  });

  return createdCompany;
};
