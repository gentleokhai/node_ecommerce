import { Request, Response, NextFunction } from 'express';
import { CreateUserInput, UserLoginPayload } from '../dto/User.dto';
import { User } from '../models';
import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} from '../utility';

export const FindUser = async (id: string | undefined, email?: string) => {
  if (email) {
    return await User.findOne({ email: email });
  } else {
    return await User.findById(id);
  }
};

export const UserSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, phoneNumber, firstName, lastName, gender, role } = <
    CreateUserInput
  >req.body;

  const existingUser = await FindUser('', email);

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

  const signature = GenerateSignature({
    id: createdUser.id,
    email: email,
  });

  const result = {
    id: createdUser.id,
    email: email,
    token: signature,
  };

  return res.json(result);
};

export const UserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <UserLoginPayload>req.body;

  const existingUser = await FindUser('', email);

  if (existingUser !== null) {
    const validation = await ValidatePassword(
      password,
      existingUser.password,
      existingUser.salt
    );

    if (validation) {
      const signature = GenerateSignature({
        id: existingUser.id,
        email: existingUser.email,
      });

      return res.json({ token: signature });
    }
  }

  return res.json({ message: 'Login credentials are not valid' });
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
    const existingUser = await FindUser('', email);

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
