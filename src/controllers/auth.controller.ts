import { Request, Response, NextFunction } from 'express';
import { Employer } from '../models';
import { login, signup } from '../services';
import { AppError } from '../utility/AppError';
import { tryCatch } from '../utility/tryCatch';

const findEmployer = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Employer.findOne({ email: email });
  } else {
    return await Employer.findOne({ id: id });
  }
};

export const signupController = tryCatch(
  async (req: Request, res: Response) => {
    const existingEmployer = await findEmployer('', req.body.email);

    if (existingEmployer !== null)
      throw new AppError('An account already exists with this email', 400);

    const signupService = await signup(req.body);
    return res.status(201).json(signupService);
  }
);

export const loginController = tryCatch(async (req: Request, res: Response) => {
  const existingEmployer = await findEmployer('', req.body.email);

  if (existingEmployer !== null) {
    const loginService = await login(req.body, {
      id: existingEmployer.id,
      email: existingEmployer.email,
      password: existingEmployer.password,
      salt: existingEmployer.salt,
    });

    if (loginService.isValidated) {
      res.status(200).json({ token: loginService.token });
      return;
    }

    throw new AppError('Login credentials are not valid', 400);
  }

  throw new AppError('Login credentials are not valid', 400);
});
