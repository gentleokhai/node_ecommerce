import { Request, Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import { UpdateUserValidationSchema } from '../dto/user';

export const createOrUpdateUserValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: 'Missing request body!' });
    }
    const data = new UpdateUserValidationSchema(
      req.body.email,
      req.body.phoneNumber,
      req.body.password,
      req.body.firstName,
      req.body.lastName,
      req.body.title,
      req.body.role,
      req.body.gender
    );

    await validateOrReject(data);

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
