import { Request, Response } from 'express';
import { CreateCategory } from '../dto/category';
import { Category } from '../models/category.model';

export const createCategoryController = async (
  req: Request<any, any, CreateCategory>,
  res: Response
) => {
  const { name } = req.body;

  const existingJob = await Category.findOne({ name: name });

  if (existingJob !== null)
    return res.json({ message: 'A job already exists with this title' });

  const createCategoryService = await Category.create({ name: name });

  res.status(201).json(createCategoryService);
};

export const getCategoryController = async (req: Request, res: Response) => {
  try {
    const category = await Category.find();

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
};
