import { Request, Response, NextFunction } from 'express';
import {
  CreateEmployeeInput,
  FilterTypes,
  UpdateEmployeeAccessInput,
  UpdateEmployeeInput,
  UpdateEmployeeStatusInput,
} from '../dto/employee';
import { Employee } from '../models';
import { createEmployee } from '../services';

export const FindEmployee = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Employee.findOne({ email: email });
  } else {
    return await Employee.findById(id).select('-password -salt');
  }
};

export const createEmployeeController = async (
  req: Request<any, any, CreateEmployeeInput>,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  const existingUser = await FindEmployee('', email);

  if (existingUser !== null)
    return res.json({ message: 'An account already exists with this email' });

  const createEmployeeService = await createEmployee(req.body);

  res.status(201).json(createEmployeeService);
};

export const updateEmployeeController = async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    gender,
    jobTitle,
    dateOfEmployment,
    phoneNumber,
  } = <UpdateEmployeeInput>req.body;

  const id = req.params.id;

  try {
    const existingEmployee = await FindEmployee(id);

    if (existingEmployee !== null) {
      existingEmployee.firstName = firstName;
      existingEmployee.lastName = lastName;
      existingEmployee.gender = gender;
      existingEmployee.jobTitle = jobTitle;
      existingEmployee.dateOfEmployment = dateOfEmployment;
      existingEmployee.phoneNumber = phoneNumber;

      await existingEmployee.save();

      return res.json(existingEmployee);
    } else {
      return res.status(400).json({ message: 'Employee does not exist' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getEmployeesController = async (req: Request, res: Response) => {
  const status = req.query.status as string;
  const accessType = req.query.accessType as string;
  const keyword = req.query.keyword as string;
  const sort = req.query.sort as string;

  const filter: FilterTypes = {};
  if (status) filter.status = status;
  if (accessType) filter.accessType = accessType;

  let sortOptions: { [key: string]: any } = { createdAt: -1, firstName: 'asc' }; // Default sorting

  if (sort) {
    const [sortField, sortOrderString] = sort.split(':');
    const sortOrder: number = sortOrderString === 'desc' ? -1 : 1;
    sortOptions[sortField] = sortOrder;
  }

  let keywordQuery = {};
  if (keyword) {
    keywordQuery = {
      $or: [
        { firstName: { $regex: keyword, $options: 'i' } },
        { lastName: { $regex: keyword, $options: 'i' } },
      ],
    };
  }

  const query = {
    ...filter,
    ...keywordQuery,
  };

  try {
    const employees = await Employee.find(query)
      .sort(sortOptions)
      .select('-password -salt');

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
};

export const getEmployeeByIdController = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;

  try {
    const employee = await FindEmployee(id);

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
};

export const updateEmployeeAccessController = async (
  req: Request,
  res: Response
) => {
  const { accessType } = <UpdateEmployeeAccessInput>req.body;

  const id = req.params.id;

  try {
    const existingEmployee = await FindEmployee(id);

    if (existingEmployee !== null) {
      existingEmployee.accessType = accessType;

      await existingEmployee.save();

      return res.json(existingEmployee);
    } else {
      return res.status(400).json({ message: 'Employee does not exist' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateEmployeeStatusController = async (
  req: Request<any, any, UpdateEmployeeStatusInput>,
  res: Response
) => {
  const id = req.params.id;

  const { status } = req.body;

  try {
    const existingEmployee = await FindEmployee(id);

    if (existingEmployee !== null) {
      existingEmployee.status = status;

      await existingEmployee.save();

      return res.json(existingEmployee);
    } else {
      return res.status(400).json({ message: 'Employee does not exist' });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: 'Internal server error' });
  }
};
