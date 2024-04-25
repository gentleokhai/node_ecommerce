import { Request, Response } from 'express';
import {
  CreateEmployeeInput,
  UpdateEmployeeAccessInput,
  UpdateEmployeeInput,
  UpdateEmployeeStatusInput,
} from '../dto/employee';
import { getEmployeesFilter } from '../dto/employee/filters';
import { Employee } from '../models';
import { createEmployee } from '../services';
import { tryCatch } from '../utility/tryCatch';
import { AppError } from '../utility/AppError';

export const FindEmployee = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Employee.findOne({ email: email });
  } else {
    return await Employee.findById(id).select('-password -salt');
  }
};

export const createEmployeeController = tryCatch(
  async (req: Request<any, any, CreateEmployeeInput>, res: Response) => {
    const { email } = req.body;

    const existingUser = await FindEmployee('', email);

    if (existingUser !== null)
      throw new AppError('An account already exists with this email', 400);

    const createEmployeeService = await createEmployee(req.body);

    res.status(201).json(createEmployeeService);
  }
);

export const updateEmployeeController = tryCatch(
  async (req: Request, res: Response) => {
    const {
      firstName,
      lastName,
      gender,
      jobTitle,
      dateOfEmployment,
      phoneNumber,
    } = req.body as UpdateEmployeeInput;

    const id = req.params.id;

    const existingEmployee = await FindEmployee(id);

    if (!existingEmployee) {
      throw new AppError('Employee does not exist', 400);
    }

    existingEmployee.firstName = firstName;
    existingEmployee.lastName = lastName;
    existingEmployee.gender = gender;
    existingEmployee.jobTitle = jobTitle;
    existingEmployee.dateOfEmployment = dateOfEmployment;
    existingEmployee.phoneNumber = phoneNumber;

    const updatedEmployee = await existingEmployee.save();

    res.json(updatedEmployee);
  }
);

export const getEmployeesController = tryCatch(
  async (req: Request, res: Response) => {
    const { query, sortOptions } = getEmployeesFilter(req);

    const employees = await Employee.find(query)
      .sort(sortOptions)
      .select('-password -salt')
      .populate('jobTitle');

    res.status(200).json(employees);
  }
);

export const getEmployeeByIdController = tryCatch(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const employee = await Employee.findById(id)
      .select('-password -salt')
      .populate('jobTitle')
      .populate({
        path: 'company',
        select: 'businessName industry id',
      });

    res.status(200).json(employee);
  }
);

export const updateEmployeeAccessController = tryCatch(
  async (req: Request<any, any, UpdateEmployeeAccessInput>, res: Response) => {
    const { accessType } = req.body;
    const id = req.params.id;

    const existingEmployee = await FindEmployee(id);

    if (!existingEmployee) {
      throw new AppError('Employee does not exist', 400);
    }

    existingEmployee.accessType = accessType;
    await existingEmployee.save();

    return res.json(existingEmployee);
  }
);

export const updateEmployeeStatusController = tryCatch(
  async (req: Request<any, any, UpdateEmployeeStatusInput>, res: Response) => {
    const id = req.params.id;
    const { status } = req.body;

    const existingEmployee = await FindEmployee(id);

    if (!existingEmployee) {
      throw new AppError('Employee does not exist', 400);
    }

    existingEmployee.status = status;
    await existingEmployee.save();

    return res.json(existingEmployee);
  }
);
