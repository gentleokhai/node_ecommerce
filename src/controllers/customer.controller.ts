import { Request, Response } from 'express';
import { tryCatch } from '../utility/tryCatch';
import { AppError } from '../utility/AppError';
import { Customer } from '../models/customer.model';
import { CreateCustomerInput } from '../dto/customer/types';
import { getCustomersFilter } from '../dto/customer/filters';

export const FindCustomer = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Customer.findOne({ email: email });
  } else {
    return await Customer.findById(id);
  }
};

export const createCustomerController = tryCatch(
  async (req: Request<any, any, CreateCustomerInput>, res: Response) => {
    const { email, phoneNumber, firstName, lastName, gender } = req.body;

    const existingUser = await FindCustomer('', email);

    if (existingUser !== null)
      throw new AppError('A customer already exists with this email', 400);

    const createdCustomer = await Customer.create({
      email,
      phoneNumber,
      firstName,
      lastName,
      gender,
    });

    res.status(201).json(createdCustomer);
  }
);

export const getCustomersController = tryCatch(
  async (req: Request, res: Response) => {
    const { query } = getCustomersFilter(req);

    const customers = await Customer.find(query);

    res.status(200).json(customers);
  }
);
