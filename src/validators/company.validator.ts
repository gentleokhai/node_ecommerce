import { Request, Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import {
  CreateCompanyInput,
  CreateCompanyValidationSchema,
} from '../dto/company';

export const createCompanyValidator = async (
  req: Request<any, any, CreateCompanyInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: 'Missing request body!' });
    }

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
    } = req.body;

    const company = new CreateCompanyValidationSchema();
    company.businessName = businessName;
    company.businessType = businessType;
    company.industry = industry;
    company.companySize = companySize;
    company.addressNumber = addressNumber;
    company.buyingCurrency = buyingCurrency;
    company.sellingCurrency = sellingCurrency;
    company.street = street;
    company.city = city;
    company.state = state;
    company.zipCode = zipCode;

    await validateOrReject(company);

    next();
  } catch (e: any) {
    console.log(e);
    const errors = e.map((err: any) => ({
      field: err.property,
      message: Object.values(err.constraints)[0],
    }));

    res.status(400).send(errors);
  }
};
