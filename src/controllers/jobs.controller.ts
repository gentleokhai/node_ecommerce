import { Request, Response } from 'express';
import { CreateJob } from '../dto/jobs';
import { Jobs } from '../models/jobs.model';

export const createJobController = async (
  req: Request<any, any, CreateJob>,
  res: Response
) => {
  const { name } = req.body;

  const existingJob = await Jobs.findOne({ name: name });

  if (existingJob !== null)
    return res.json({ message: 'A job already exists with this title' });

  const createJobService = await Jobs.create({ name: name });

  res.status(201).json(createJobService);
};

export const getJobsController = async (req: Request, res: Response) => {
  try {
    const jobs = await Jobs.find();

    res.status(200).json(jobs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
};
