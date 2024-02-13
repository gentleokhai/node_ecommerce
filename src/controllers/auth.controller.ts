import { Request, Response, NextFunction } from 'express';
import { CreateUserInput, UserLoginPayload } from '../dto/user/types';
import { User } from '../models';
import { login, signup } from '../services';

const findUser = async (id: string | undefined, email?: string) => {
  if (email) {
    return await User.findOne({ email: email });
  } else {
    return await User.findById(id);
  }
};

export const signupController = async (req: Request, res: Response) => {
  const existingUser = await findUser('', req.body.email);

  if (existingUser !== null)
    return res
      .status(400)
      .json({ message: 'An account already exists with this email' });

  const signupService = await signup(req.body);
  return res.status(201).json(signupService);
};

export const loginController = async (req: Request, res: Response) => {
  const existingUser = await findUser('', req.body.email);

  if (existingUser !== null) {
    const loginService = await login(req.body, {
      id: existingUser.id,
      email: existingUser.email,
      password: existingUser.password,
      salt: existingUser.salt,
    });

    if (loginService.isValidated) {
      return res.status(200).json({ token: loginService.token });
    }

    return res.status(400).json({ message: 'Login credentials are not valid' });
  }

  return res.status(400).json({ message: 'Login credentials are not valid' });
};
