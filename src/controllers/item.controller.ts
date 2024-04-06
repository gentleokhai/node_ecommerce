import { Request, Response, NextFunction } from 'express';
import { CreateItem } from '../dto/item';
import { Item } from '../models/items.model';
import { createItem } from '../services/item.service';

export const createItemController = async (
  req: Request<any, any, CreateItem>,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    category,
    unit,
    sku,
    weight,
    description,
    currency,
    costPrice,
    sellingPrice,
    wholesalePrice,
    quantityInPack,
    openingStock,
    lowStock,
  } = req.body;

  const existingItem = await Item.findOne({ name: name });

  if (existingItem !== null)
    return res.json({ message: 'An item already exists with this name' });

  const createItemService = await createItem({
    image: req.file && req.file.filename,
    name,
    category,
    unit,
    sku,
    weight,
    description,
    currency,
    costPrice,
    sellingPrice,
    wholesalePrice,
    quantityInPack,
    openingStock,
    lowStock,
  });

  res.status(201).json(createItemService);
};
