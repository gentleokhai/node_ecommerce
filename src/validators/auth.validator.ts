import { Request, Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import {
  ChangePasswordValidationSchema,
  LoginValidationSchema,
  SignupValidationSchema,
} from '../dto/auth';
import { AppError } from '../utility/AppError';

export const signupValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new AppError('Missing request body!', 400);
    }
    const user = new SignupValidationSchema(
      req.body.email,
      req.body.phoneNumber,
      req.body.password
    );

    await validateOrReject(user);

    next();
  } catch (e: any) {
    console.log(e);
    const errors = e.map((err: any) => ({
      field: err.property,
      message: Object.values(err.constraints)[0],
    }));

    res.status(400).send(errors);
  }
};

export const loginValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new AppError('Missing request body!', 400);
    }
    const user = new LoginValidationSchema(req.body.email, req.body.password);
    user.email = req.body.email;
    user.password = req.body.password;

    await validateOrReject(user);

    next();
  } catch (e: any) {
    console.log(e);
    const errors = e.map((err: any) => ({
      field: err.property,
      message: Object.values(err.constraints)[0],
    }));

    res.status(400).send(errors);
  }
};

export const changePasswordValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new AppError('Missing request body!', 400);
    }
    const user = new ChangePasswordValidationSchema(
      req.body.password,
      req.body.confirmPassword
    );

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;

    await validateOrReject(user);

    next();
  } catch (e: any) {
    console.log(e);
    const errors = e.map((err: any) => ({
      field: err.property,
      message: Object.values(err.constraints)[0],
    }));

    res.status(400).send(errors);
  }
};
