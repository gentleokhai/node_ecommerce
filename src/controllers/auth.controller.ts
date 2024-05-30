import { Request, Response, NextFunction } from 'express';
import { ChangePasswordPayload } from '../dto/auth';
import { Employee } from '../models';
import { login, signup } from '../services';
import { AppError } from '../utility/AppError';
import { tryCatch } from '../utility/tryCatch';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const findEmployee = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Employee.findOne({ email: email });
  } else {
    return await Employee.findOne({ id: id });
  }
};

export const signupController = tryCatch(
  async (req: Request, res: Response) => {
    const existingEmployee = await findEmployee('', req.body.email);

    if (existingEmployee !== null)
      throw new AppError('An account already exists with this email', 400);

    const signupService = await signup(req.body);
    return res.status(201).json(signupService);
  }
);

export const loginController = tryCatch(async (req: Request, res: Response) => {
  const existingEmployee = await findEmployee('', req.body.email);

  if (existingEmployee !== null) {
    const loginService = await login(req.body, {
      id: existingEmployee.id,
      email: existingEmployee.email,
      password: existingEmployee.password,
      salt: existingEmployee.salt,
    });

    if (loginService.isValidated) {
      res.status(200).json({ token: loginService.token });
      return;
    }

    throw new AppError('Login credentials are not valid', 400);
  }

  throw new AppError('Login credentials are not valid', 400);
});

export const changePasswordController = tryCatch(
  async (req: Request<any, any, ChangePasswordPayload>, res: Response) => {
    const { token } = req.query;

    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      throw new AppError('Passwords do not match', 400);
    }

    if (!token) {
      throw new AppError('Invalid token', 400);
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token as string, process.env.JWT_SECRET as string);
    } catch (err) {
      throw new AppError('Invalid or expired token', 400);
    }

    const employee = await Employee.findOne({ email: decoded.email });

    if (!employee) {
      throw new AppError('Invalid token or user not found', 400);
    }

    if (employee.tokenExpiration && employee.tokenExpiration < new Date()) {
      throw new AppError('Token has expired', 400);
    }

    employee.verified = true;
    employee.verificationToken = undefined;
    employee.tokenExpiration = undefined;
    employee.password = password;
    await employee.save();

    res.status(200).json({ message: 'Password Created' });
  }
);
