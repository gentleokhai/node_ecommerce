import { Request, Response, NextFunction } from 'express';
import { CreateUserInput } from '../dto/User.dto';
import { User } from '../models';

export const FindUser = async (id: string) => {
  if (id) {
    return await User.findById(id);
  }
};

export const CreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, gender, role } = <CreateUserInput>req.body;

  const createdUser = await User.create({
    firstName: firstName,
    lastName: lastName,
    gender: gender,
    role: role,
  });

  return res.json(createdUser);
};
