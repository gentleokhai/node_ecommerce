import { Request, Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import {
  CreateEmployeeInput,
  CreateEmployeeValidationSchema,
  UpdateEmployeeInput,
  UpdateEmployeeValidationSchema,
} from '../dto/employee';

export const createEmployeeValidator = async (
  req: Request<any, any, CreateEmployeeInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: 'Missing request body!' });
    }

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      company,
      dateOfEmployment,
      jobTitle,
      gender,
      role,
    } = req.body;

    const employee = new CreateEmployeeValidationSchema();
    employee.firstName = firstName;
    employee.lastName = lastName;
    employee.email = email;
    employee.phoneNumber = phoneNumber;
    employee.company = company;
    employee.dateOfEmployment = dateOfEmployment;
    employee.jobTitle = jobTitle;
    employee.gender = gender;
    employee.role = role;

    await validateOrReject(employee);

    next();
  } catch (e: any) {
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
      return res.status(400).send({ message: 'Missing request body!' });
    }

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      dateOfEmployment,
      jobTitle,
      gender,
      role,
    } = req.body;

    const employee = new UpdateEmployeeValidationSchema();
    employee.firstName = firstName;
    employee.lastName = lastName;
    employee.email = email;
    employee.phoneNumber = phoneNumber;
    employee.dateOfEmployment = dateOfEmployment;
    employee.jobTitle = jobTitle;
    employee.gender = gender;
    employee.role = role;

    await validateOrReject(employee);

    next();
  } catch (e: any) {
    const errors = e.map((err: any) => ({
      field: err.property,
      message: Object.values(err.constraints)[0],
    }));

    res.status(400).send(errors);
  }
};
