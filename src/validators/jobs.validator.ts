import { Request, Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import { CreateJob, CreateJobValidationSchema } from '../dto/jobs';

export const createJobValidator = async (
  req: Request<any, any, CreateJob>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: 'Missing request body!' });
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
