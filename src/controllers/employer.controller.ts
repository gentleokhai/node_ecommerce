import { Request, Response, NextFunction } from 'express';
import { UpdateEmployerInput } from '../dto/employer/types';
import { Employer } from '../models';

export const FindEmployer = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Employer.findOne({ email: email });
  } else {
    return await Employer.findById(id).select('-password -salt');
  }
};

export const getEmployerController = async (req: Request, res: Response) => {
  const user = req.user;

  if (user) {
    try {
      const employer = await FindEmployer(user?.id);

      if (employer) {
        return res.status(200).json(employer);
      } else {
        return res.status(400).json({ message: 'User information not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching data' });
    }
  }

  return res.status(400).json({ message: 'User information not found' });
};

export const updateEmployerController = async (req: Request, res: Response) => {
  const { firstName, lastName, gender } = <UpdateEmployerInput>req.body;

  const user = req.user;

  try {
    const existingUser = await FindEmployer(user?.id);

    if (existingUser !== null) {
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.gender = gender;

      await existingUser.save();

      return res.json(existingUser);
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }

  return res.status(400).json({ message: 'User information not found' });
};
