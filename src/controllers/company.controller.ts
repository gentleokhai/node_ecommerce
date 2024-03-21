import { Request, Response, NextFunction } from 'express';
import { createCompany } from '../services/company.service';

export const createCompanyController = async (req: Request, res: Response) => {
  const user = req.user;

  if (user) {
    const companyService = await createCompany(req.body);

    return res.status(201).json(companyService);
  }

  return res.json({ message: 'User information not found' });
};
