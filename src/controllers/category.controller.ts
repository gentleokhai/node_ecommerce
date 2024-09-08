import { Request, Response } from 'express';
import { CreateCategory } from '../dto/category';
import { Category } from '../models/category.model';
import { tryCatch } from '../utility/tryCatch';
import { AppError } from '../utility/AppError';

export const createCategoryController = tryCatch(
  async (req: Request<any, any, CreateCategory>, res: Response) => {
    const { name } = req.body;
    const company = req.company;

    const existingCategory = await Category.findOne({
      name,
      company: company?._id,
    });

    if (existingCategory) {
      throw new AppError('A category already exists with this name', 400);
    }

    const createCategoryService = await Category.create({
      name,
      company: company?._id,
    });

    res.status(201).json(createCategoryService);
  }
);

export const getCategoryController = tryCatch(
  async (req: Request, res: Response) => {
    const company = req.company;

    const category = await Category.find({
      company: company?._id,
    });

    res.status(200).json(category);
  }
);
