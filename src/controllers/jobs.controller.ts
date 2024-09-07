import { Request, Response } from 'express';
import { CreateJob } from '../dto/jobs';
import { Jobs } from '../models/jobs.model';
import { tryCatch } from '../utility/tryCatch';
import { AppError } from '../utility/AppError';

export const createJobController = tryCatch(
  async (req: Request<any, any, CreateJob>, res: Response) => {
    const { name } = req.body;

    const company = req.company;

    const existingJob = await Jobs.findOne({ name: name });

    if (existingJob !== null)
      throw new AppError('A job already exists with this title', 400);

    const createJobService = await Jobs.create({
      name: name,
      company: company?._id,
    });

    res.status(201).json(createJobService);
  }
);

export const getJobsController = tryCatch(
  async (req: Request, res: Response) => {
    const company = req.company;

    const jobs = await Jobs.find({ company: company?._id });

    res.status(200).json(jobs);
  }
);
