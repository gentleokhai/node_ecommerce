import { Request, Response, NextFunction } from 'express';
import { CreateEmployeeInput } from '../dto/employee';
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
    role,
    jobTitle,
    dateOfEmployment,
    phoneNumber,
  } = <CreateEmployeeInput>req.body;

  const id = req.params.id;

  try {
    const existingEmployee = await FindEmployee(id);

    if (existingEmployee !== null) {
      existingEmployee.firstName = firstName;
      existingEmployee.lastName = lastName;
      existingEmployee.gender = gender;
      existingEmployee.role = role;
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
  try {
    const employees = await Employee.find().select('-password -salt');

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
