import { Request, Response } from 'express';
import {
  CreateEmployeeInput,
  UpdateEmployeeAccessInput,
  UpdateEmployeeInput,
  UpdateEmployeeStatusInput,
  UpdateEmployeeOnboardingInput,
} from '../dto/employee';
import { getEmployeesFilter } from '../dto/employee/filters';
import { Company, Employee } from '../models';
import { createEmployee } from '../services';
import { tryCatch } from '../utility/tryCatch';
import { AppError } from '../utility/AppError';
import sendEmail from '../utility/mailer';
import { generateToken } from '../utility/generate-token';
import dotenv from 'dotenv';
import { AccessType, Status } from '../dto/general';

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

    const company = req.company;

    const existingUser = await Employee.findOne({
      email: email,
    });

    if (existingUser !== null)
      throw new AppError('An account already exists with this email', 400);

    const employee = await createEmployee({
      ...req.body,
      company: company?._id,
    });

    const token = generateToken(email);

    employee.verificationToken = token;
    employee.tokenExpiration = new Date(Date.now() + 3600000); // 1 hour from now
    await employee.save();

    const verificationLink = `${process.env.CLIENT_URL}/auth/new-password?token=${token}`;

    if (employee.accessType !== AccessType.NOACCESS) {
      await sendEmail({
        to: employee.email,
        from: 'Uche from Zulu',
        subject: 'ZULU ACCOUNT ACTIVATION',
        template: 'email',
        firstName: employee.firstName,
        verificationLink,
      }).catch((error) => {
        console.log(error);
        throw new AppError(
          'Failed to send verification email. Please try again later.',
          500
        );
      });

      employee.status = Status.INVITED;
      await employee.save();
    } else {
      employee.status = Status.ACTIVE;
      await employee.save();
    }

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

    firstName && (existingEmployee.firstName = firstName);
    lastName && (existingEmployee.lastName = lastName);
    gender && (existingEmployee.gender = gender);
    jobTitle && (existingEmployee.jobTitle = jobTitle);
    dateOfEmployment && (existingEmployee.dateOfEmployment = dateOfEmployment);
    phoneNumber && (existingEmployee.phoneNumber = phoneNumber);

    await existingEmployee.save();

    res.json({ message: 'Employee updated' });
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

    const company = req.company;

    const page = parseInt(req.query.page as string, 10) || 1;
    const pagePerLimit = parseInt(req.query.pagePerLimit as string, 10) || 10;

    const startIndex = (page - 1) * pagePerLimit;
    const endIndex = page * pagePerLimit;

    const employees = await Employee.find({ ...query, company: company?._id })
      .sort(sortOptions)
      .select('-password -salt -tokenExpiration -verificationToken')
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

    const company = req.company;

    const employee = await Employee.findOne({
      _id: id,
      company: company?._id,
    })
      .select('-password -salt -tokenExpiration -verificationToken')
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
