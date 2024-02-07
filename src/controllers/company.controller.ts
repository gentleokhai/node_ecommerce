import { Request, Response, NextFunction } from 'express';
import { CreateCompanyInput } from '../dto/Company.dto';
import { Company } from '../models';

export const CreateCompany = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
  } = <CreateCompanyInput>req.body;

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

  return res.json(createdCompany);
};
