import { Request, Response } from 'express';
import { Employee } from '../models';
import { createCompany } from '../services/company.service';
import { tryCatch } from '../utility/tryCatch';
import { AppError } from '../utility/AppError';

export const createCompanyController = tryCatch(
  async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new AppError('User information not found', 400);
    }

    const employee = await Employee.findById(user.id);

    if (!employee) {
      throw new AppError('User not found', 400);
    }

    if (employee.company) {
      throw new AppError('User already has a company registered', 400);
    }

    const companyService = await createCompany(req.body);

    await Employee.findByIdAndUpdate(user.id, { company: companyService.id });

    res.status(201).json(companyService);
  }
);
