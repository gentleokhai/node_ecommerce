import { Request, Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import { CreateCompanyValidationSchema } from '../dto/company';

export const createCompanyValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: 'Missing request body!' });
    }
    const data = new CreateCompanyValidationSchema(
      req.body.businessName,
      req.body.businessType,
      req.body.industry,
      req.body.companySize,
      req.body.addressNumber,
      req.body.buyingCurrency,
      req.body.sellingCurrency,
      req.body.street,
      req.body.city,
      req.body.state,
      req.body.zipCode
    );

    await validateOrReject(data);

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
