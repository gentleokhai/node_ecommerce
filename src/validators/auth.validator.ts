import { Request, Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import { LoginValidationSchema, SignupValidationSchema } from '../dto/auth';

export const signupValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: 'Missing request body!' });
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
      return res.status(400).send({ message: 'Missing request body!' });
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
