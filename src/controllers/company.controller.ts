import { Request, Response, NextFunction } from 'express';
import { createCompany } from '../services/company.service';
import { associateUserWithCompany } from './user.controller';

export const createCompanyController = async (req: Request, res: Response) => {
  const user = req.user;

  if (user) {
    const companyService = await createCompany(req.body);

    await associateUserWithCompany(companyService.id, user.id);

    return res.status(201).json(companyService);
  }

  return res.json({ message: 'User information not found' });
};
