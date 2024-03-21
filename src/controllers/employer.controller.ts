import { Request, Response, NextFunction } from 'express';
import { UpdateEmployerInput } from '../dto/employer/types';
import { Employee } from '../models';
import { createEmployee } from '../services';
import { GeneratePassword, GenerateSalt } from '../utility';

export const FindUser = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Employee.findOne({ email: email });
  } else {
    return await Employee.findOne({ id: id });
  }
};

export const updateEmployerController = async (req: Request, res: Response) => {
  const { email, phoneNumber, firstName, lastName, gender, role } = <
    UpdateEmployerInput
  >req.body;

  const user = req.user;

  if (user) {
    try {
      const existingUser = await FindUser(user?.id);

      if (existingUser !== null) {
        existingUser.firstName = firstName;
        existingUser.lastName = lastName;
        // existingUser.email = email;
        // existingUser.phoneNumber = phoneNumber;
        existingUser.gender = gender;
        existingUser.role = role;

        //TODO: make the frontend include email and phone number for this update endpoint

        await existingUser.save();

        const result = {
          firstName,
          lastName,
          email,
          gender,
          role,
          phoneNumber,
        };
        return res.json(result);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(400).json({ message: 'User information not found' });
};

export const associateUserWithCompany = async (
  userId: string,
  companyId: string
) => {
  try {
    await Employee.findByIdAndUpdate(userId, { company: companyId });
  } catch (err) {
    throw err;
  }
};
