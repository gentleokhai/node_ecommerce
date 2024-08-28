import { Request, Response } from 'express';
import { Company, Employee } from '../models';
import { createCompany } from '../services/company.service';
import { tryCatch } from '../utility/tryCatch';
import { AppError } from '../utility/AppError';
import { CreateCompanyInput, UpdateViewingCurrencyInput } from '../dto/company';
import { ExchangeRates } from '../models/exchangeRates.model';

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
    const id = req.headers['companyid'] as string;

    if (!id) {
      throw new AppError('Company ID is required in headers', 400);
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
    const id = req.headers['companyid'] as string;

    if (!id) {
      throw new AppError('Company ID is required in headers', 400);
    }

    const company = await Company.findById(id).select('-users');

    res.status(200).json(company);
  }
);

export const getCompanyCurrenciesController = tryCatch(
  async (req: Request, res: Response) => {
    const id = req.headers['companyid'] as string;

    if (!id) {
      throw new AppError('Company ID is required in headers', 400);
    }

    const currencies = await Company.findById(id).select(
      'buyingCurrency sellingCurrency'
    );

    res.status(200).json(currencies);
  }
);

export const updateViewingCurrencyController = tryCatch(
  async (req: Request, res: Response) => {
    const id = req.headers['companyid'] as string;

    if (!id) {
      throw new AppError('Company ID is required in headers', 400);
    }

    const { viewingCurrency } = <UpdateViewingCurrencyInput>req.body;

    const existingCompany = await Company.findById(id);

    const exchangeRate = await ExchangeRates.findOne({
      currencyCode: viewingCurrency,
    });

    if (!exchangeRate) {
      throw new AppError(`Exchange rate for ${viewingCurrency} not found`, 400);
    }

    if (existingCompany !== null) {
      existingCompany.viewingCurrency = viewingCurrency;

      await existingCompany.save();

      return res.json({ message: 'Viewing currency updated!' });
    }

    throw new AppError('Company not found', 400);
  }
);
