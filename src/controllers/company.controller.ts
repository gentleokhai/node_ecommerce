import { Request, Response } from 'express';
import { Company, Employee } from '../models';
import { createCompany } from '../services/company.service';
import { tryCatch } from '../utility/tryCatch';
import { AppError } from '../utility/AppError';
import { CreateCompanyInput } from '../dto/company';

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

export const updateCompanyController = tryCatch(
  async (req: Request, res: Response) => {
    const id = req.params.id;
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
    } = <CreateCompanyInput>req.body;

    const existingCompany = await Company.findById(id);

    if (existingCompany !== null) {
      businessName && (existingCompany.businessName = businessName);
      businessType && (existingCompany.businessType = businessType);
      industry && (existingCompany.industry = industry);
      companySize && (existingCompany.companySize = companySize);
      addressNumber && (existingCompany.addressNumber = addressNumber);
      buyingCurrency && (existingCompany.buyingCurrency = buyingCurrency);
      sellingCurrency && (existingCompany.sellingCurrency = sellingCurrency);
      street && (existingCompany.street = street);
      city && (existingCompany.city = city);
      state && (existingCompany.state = state);
      zipCode && (existingCompany.zipCode = zipCode);

      await existingCompany.save();

      return res.json({ message: 'Company updated!' });
    }

    throw new AppError('User information not found', 400);
  }
);

export const getCompanyByIdController = tryCatch(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const company = await Company.findById(id).select('-users');

    res.status(200).json(company);
  }
);
