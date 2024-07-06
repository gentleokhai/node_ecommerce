import { Request, Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import { AppError } from '../utility/AppError';
import { CreateCustomerInput } from '../dto/customer/types';
import {
  CreateCustomerValidationSchema,
  UpdateCustomerValidationSchema,
} from '../dto/customer/customer.dto';

export const createCustomerValidator = async (
  req: Request<any, any, CreateCustomerInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new AppError('Missing request body!', 400);
    }

    const { firstName, lastName, email, phoneNumber, gender, group } = req.body;

    const customer = new CreateCustomerValidationSchema();
    customer.firstName = firstName;
    customer.lastName = lastName;
    customer.email = email;
    customer.phoneNumber = phoneNumber;
    customer.gender = gender;
    customer.group = group as string;

    await validateOrReject(customer);

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

export const updateCustomerValidator = async (
  req: Request<any, any, CreateCustomerInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new AppError('Missing request body!', 400);
    }

    const { firstName, lastName, email, phoneNumber, gender, group } = req.body;

    const customer = new UpdateCustomerValidationSchema();
    customer.firstName = firstName;
    customer.lastName = lastName;
    customer.email = email;
    customer.phoneNumber = phoneNumber;
    customer.gender = gender;
    customer.group = group as string;

    await validateOrReject(customer);

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
