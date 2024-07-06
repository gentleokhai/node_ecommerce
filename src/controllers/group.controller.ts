import { Request, Response } from 'express';
import { tryCatch } from '../utility/tryCatch';
import { AppError } from '../utility/AppError';
import { CreateGroup } from '../dto/group';
import { Group } from '../models/group.model';

export const createGroupController = tryCatch(
  async (req: Request<any, any, CreateGroup>, res: Response) => {
    const { name } = req.body;

    const existingGroup = await Group.findOne({ name: name });

    if (existingGroup !== null)
      throw new AppError('A group already exists with this title', 400);

    const createGroupService = await Group.create({ name: name });

    res.status(201).json(createGroupService);
  }
);

export const getGroupController = tryCatch(
  async (req: Request, res: Response) => {
    const groups = await Group.find();

    res.status(200).json(groups);
  }
);
