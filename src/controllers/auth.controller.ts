import { Request, Response, NextFunction } from 'express';
import { Employer } from '../models';
import { login, signup } from '../services';

const findEmployer = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Employer.findOne({ email: email });
  } else {
    return await Employer.findOne({ id: id });
  }
};

export const signupController = async (req: Request, res: Response) => {
  const existingEmployer = await findEmployer('', req.body.email);

  if (existingEmployer !== null)
    return res
      .status(400)
      .json({ message: 'An account already exists with this email' });

  const signupService = await signup(req.body);
  return res.status(201).json(signupService);
};

export const loginController = async (req: Request, res: Response) => {
  const existingEmployer = await findEmployer('', req.body.email);

  if (existingEmployer !== null) {
    const loginService = await login(req.body, {
      id: existingEmployer.id,
      email: existingEmployer.email,
      password: existingEmployer.password,
      salt: existingEmployer.salt,
    });

    if (loginService.isValidated) {
      return res.status(200).json({ token: loginService.token });
    }

    return res.status(400).json({ message: 'Login credentials are not valid' });
  }

  return res.status(400).json({ message: 'Login credentials are not valid' });
};
