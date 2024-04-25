import { Request, Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import {
  CreateEmployeeInput,
  CreateEmployeeValidationSchema,
  UpdateEmployeeStatusInput,
  UpdateEmployeeStatusSchema,
  UpdateEmployeeAccessInput,
  UpdateEmployeeAccessValidationSchema,
  UpdateEmployeeInput,
  UpdateEmployeeValidationSchema,
} from '../dto/employee';
import { AppError } from '../utility/AppError';

export const createEmployeeValidator = async (
  req: Request<any, any, CreateEmployeeInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new AppError('Missing request body!', 400);
    }

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      company,
      dateOfEmployment,
      jobTitle,
      status,
      gender,
      accessType,
    } = req.body;

    const employee = new CreateEmployeeValidationSchema();
    employee.firstName = firstName;
    employee.lastName = lastName;
    employee.email = email;
    employee.phoneNumber = phoneNumber;
    employee.company = company;
    employee.dateOfEmployment = dateOfEmployment;
    employee.jobTitle = jobTitle;
    employee.status = status;
    employee.gender = gender;
    employee.accessType = accessType;

    await validateOrReject(employee);

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

export const updateEmployeeValidator = async (
  req: Request<any, any, UpdateEmployeeInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new AppError('Missing request body!', 400);
    }

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      dateOfEmployment,
      jobTitle,
      gender,
    } = req.body;

    const employee = new UpdateEmployeeValidationSchema();
    employee.firstName = firstName;
    employee.lastName = lastName;
    employee.email = email;
    employee.phoneNumber = phoneNumber;
    employee.dateOfEmployment = dateOfEmployment;
    employee.jobTitle = jobTitle;
    employee.gender = gender;

    await validateOrReject(employee);

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

export const updateEmployeeAccessValidator = async (
  req: Request<any, any, UpdateEmployeeAccessInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new AppError('Missing request body!', 400);
    }

    const { accessType } = req.body;

    const employee = new UpdateEmployeeAccessValidationSchema();
    employee.accessType = accessType;

    await validateOrReject(employee);

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

export const updateEmployeeStatusValidator = async (
  req: Request<any, any, UpdateEmployeeStatusInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new AppError('Missing request body!', 400);
    }

    const { status } = req.body;

    const employee = new UpdateEmployeeStatusSchema();
    employee.status = status;

    await validateOrReject(employee);

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
