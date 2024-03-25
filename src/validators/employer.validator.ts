import { Request, Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import {
  UpdateEmployerInput,
  UpdateEmployerValidationSchema,
} from '../dto/employer';

export const createOrUpdateEmployerValidator = async (
  req: Request<any, any, UpdateEmployerInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: 'Missing request body!' });
    }

    const { firstName, lastName, gender } = req.body;

    const employer = new UpdateEmployerValidationSchema();
    employer.firstName = firstName;
    employer.lastName = lastName;
    employer.gender = gender;

    await validateOrReject(employer);

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
