import { Request, Response, NextFunction } from 'express';
import { Company, CompanyDoc } from '../models';
import { AppError } from '../utility/AppError';

declare global {
  namespace Express {
    interface Request {
      company?: CompanyDoc;
    }
  }
}

export const validateCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const companyId = req.headers['companyid'] as string;

  if (!companyId) {
    return next(new AppError('Company ID is required in headers', 400));
  }

  const company = await Company.findById(companyId);

  if (!company) {
    return next(new AppError('Company not found', 400));
  }

  req.company = company;
  next();
};
