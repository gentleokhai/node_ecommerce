import { Request, Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import {
  CreateCategory,
  CreateCategoryValidationSchema,
} from '../dto/category';
import { AppError } from '../utility/AppError';

export const createCategoryValidator = async (
  req: Request<any, any, CreateCategory>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new AppError('Missing request body!', 400);
    }

    const { name } = req.body;

    const category = new CreateCategoryValidationSchema();
    category.name = name;

    await validateOrReject(category);

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
