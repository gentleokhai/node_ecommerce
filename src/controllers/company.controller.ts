import { Request, Response } from 'express';
import { Employer } from '../models';
import { createCompany } from '../services/company.service';
import { tryCatch } from '../utility/tryCatch';
import { AppError } from '../utility/AppError';

export const createCompanyController = tryCatch(
  async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new AppError('User information not found', 400);
    }

    const employer = await Employer.findById(user.id);

    if (!employer) {
      throw new AppError('Employer not found', 400);
    }

    if (employer.company) {
      throw new AppError('Employer already has a company registered', 400);
    }

    const companyService = await createCompany(req.body);

    await Employer.findByIdAndUpdate(user.id, { company: companyService.id });

    res.status(201).json(companyService);
  }
);
