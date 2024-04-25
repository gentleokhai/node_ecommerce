import { Request, Response } from 'express';
import { UpdateEmployerInput } from '../dto/employer/types';
import { Employer } from '../models';
import { tryCatch } from '../utility/tryCatch';
import { AppError } from '../utility/AppError';

export const FindEmployer = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Employer.findOne({ email: email });
  } else {
    return await Employer.findById(id).select('-password -salt');
  }
};

export const getEmployerController = tryCatch(
  async (req: Request, res: Response) => {
    const user = req.user;

    if (user) {
      const employer = await FindEmployer(user?.id);

      if (employer) {
        return res.status(200).json(employer);
      } else {
        throw new AppError('User information not found', 400);
      }
    }

    throw new AppError('User information not found', 400);
  }
);

export const updateEmployerController = tryCatch(
  async (req: Request, res: Response) => {
    const { firstName, lastName, gender } = <UpdateEmployerInput>req.body;

    const user = req.user;

    const existingUser = await FindEmployer(user?.id);

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
