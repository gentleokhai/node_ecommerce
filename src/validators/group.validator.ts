import { Request, Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import { CreateGroup, CreateGroupValidationSchema } from '../dto/group';
import { AppError } from '../utility/AppError';

export const createGroupValidator = async (
  req: Request<any, any, CreateGroup>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new AppError('Missing request body!', 400);
    }

    const { name } = req.body;

    const group = new CreateGroupValidationSchema();
    group.name = name;

    await validateOrReject(group);

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
