import { Request, Response, NextFunction } from 'express';
import { Employer, EmployerDoc } from '../models';
import { createCompany } from '../services/company.service';

export const createCompanyController = async (req: Request, res: Response) => {
  const user = req.user;

  if (user) {
    const employer: EmployerDoc | null = await Employer.findById(user.id);

    if (employer && employer.company) {
      return res
        .status(400)
        .json({ message: 'Employer already has a company registered' });
    }

    const companyService = await createCompany(req.body);

    await Employer.findByIdAndUpdate(user.id, { company: companyService.id });

    return res.status(201).json(companyService);
  }

  return res.json({ message: 'User information not found' });
};
