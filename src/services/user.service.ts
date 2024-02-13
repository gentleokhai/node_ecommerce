import { Request, Response, NextFunction } from 'express';
import { CreateUserInput, UserLoginPayload } from '../dto/user';
import { User } from '../models';
import { GeneratePassword, GenerateSalt } from '../utility';

export const findUser = async (id: string | undefined, email?: string) => {
  if (email) {
    return await User.findOne({ email: email });
  } else {
    return await User.findById(id);
  }
};

export const CreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, phoneNumber, firstName, lastName, gender, role } = <
    CreateUserInput
  >req.body;

  const user = req.user;

  if (user) {
    const existingUser = await findUser('', email);

    if (existingUser !== null)
      return res.json({ message: 'An account already exists with this email' });

    const salt = await GenerateSalt();
    const accountPassword = await GeneratePassword(password, salt);

    const createdUser = await User.create({
      email,
      password: accountPassword,
      phoneNumber,
      firstName,
      salt,
      lastName,
      gender,
      role,
    });

    const result = {
      id: createdUser.id,
      email,
      firstName,
      lastName,
      gender,
      role,
      phoneNumber,
    };

    return res.json(result);
  }
};
