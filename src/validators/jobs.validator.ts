import { Request, Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import { CreateJob, CreateJobValidationSchema } from '../dto/jobs';
import { AppError } from '../utility/AppError';

export const createJobValidator = async (
  req: Request<any, any, CreateJob>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new AppError('Missing request body!', 400);
    }

    const { name } = req.body;

    const job = new CreateJobValidationSchema();
    job.name = name;

    await validateOrReject(job);

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
