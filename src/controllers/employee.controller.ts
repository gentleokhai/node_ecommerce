import { Request, Response } from 'express';
import {
  CreateEmployeeInput,
  UpdateEmployeeAccessInput,
  UpdateEmployeeInput,
  UpdateEmployeeStatusInput,
  UpdateEmployeeOnboardingInput,
} from '../dto/employee';
import { getEmployeesFilter } from '../dto/employee/filters';
import { Employee } from '../models';
import { createEmployee } from '../services';
import { tryCatch } from '../utility/tryCatch';
import { AppError } from '../utility/AppError';
import sendEmail from '../utility/mailer';
import { generateToken } from '../utility/generate-token';
import dotenv from 'dotenv';

dotenv.config();

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

    const employee = await createEmployee(req.body);

    const token = generateToken(email);

    employee.verificationToken = token;
    employee.tokenExpiration = new Date(Date.now() + 3600000); // 1 hour from now
    await employee.save();

    const verificationLink = `${process.env.CLIENT_URL}/auth/new-password?token=${token}`;

    await sendEmail({
      to: 'chivoomodu@gmail.com',
      from: 'Uche from Zulu',
      subject: 'ZULU ACCOUNT ACTIVATION',
      template: 'email',
      firstName: employee.firstName,
      verificationLink,
    }).catch(() => {
      throw new AppError(
        'Failed to send verification email. Please try again later.',
        500
      );
    });

    res.status(201).json(employee);
  }
);

export const getMeController = tryCatch(async (req: Request, res: Response) => {
  const user = req.user;

  if (user) {
    const employee = await FindEmployee(user?.id);

    if (employee) {
      return res.status(200).json(employee);
    } else {
      throw new AppError('User information not found', 400);
    }
  }

  throw new AppError('User information not found', 400);
});

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

export const updateEmployeeOnboardingController = tryCatch(
  async (req: Request, res: Response) => {
    const { firstName, lastName, gender } = <UpdateEmployeeOnboardingInput>(
      req.body
    );

    const user = req.user;

    const existingUser = await FindEmployee(user?.id);

    if (existingUser !== null) {
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.gender = gender;

      await existingUser.save();

      return res.json(existingUser);
    }

    throw new AppError('User information not found', 400);
  }
);

export const getEmployeesController = tryCatch(
  async (req: Request, res: Response) => {
    const { query, sortOptions } = getEmployeesFilter(req);

    const page = parseInt(req.query.page as string, 10) || 1;
    const pagePerLimit = parseInt(req.query.pagePerLimit as string, 10) || 10;

    const startIndex = (page - 1) * pagePerLimit;
    const endIndex = page * pagePerLimit;

    const employees = await Employee.find(query)
      .sort(sortOptions)
      .select('-password -salt')
      .populate('jobTitle');

    const paginatedEmployees = employees.slice(startIndex, endIndex);

    const totalPages = Math.ceil(employees.length / pagePerLimit);
    const totalEmployees = employees.length - 1;

    const nextPage = page < totalPages ? page + 1 : null;
    const previousPage = page > 1 ? page - 1 : null;
    const currentPage = page;

    res.status(200).json({
      result: paginatedEmployees,
      totalPages,
      pagePerLimit,
      totalEmployees,
      nextPage,
      previousPage,
      currentPage,
    });
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
