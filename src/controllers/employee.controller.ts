import { Request, Response, NextFunction } from 'express';
import { Employee } from '../models';
import { createEmployee } from '../services';

export const FindUser = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Employee.findOne({ email: email });
  } else {
    return await Employee.findOne({ id: id });
  }
};

export const createEmployeeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  const { email } = req.body;

  if (user) {
    const existingUser = await FindUser('', email);

    if (existingUser !== null)
      return res.json({ message: 'An account already exists with this email' });

    const createEmployeeService = await createEmployee(req.body);

    res.status(201).json(createEmployeeService);
  }
};

export const getEmployeeController = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find().select('-password -salt');

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
};
