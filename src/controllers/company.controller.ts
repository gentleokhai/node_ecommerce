import { Request, Response, NextFunction } from 'express';
import { CreateCompanyInput } from '../dto/company/types';
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

  const user = req.user;

  if (user) {
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
  }

  return res.json({ message: 'User information not found' });
};
