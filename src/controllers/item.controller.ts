import { Request, Response, NextFunction } from 'express';
import { upload } from '../config/cloudinary';
import { CreateItem, UpdateItemPrice, UpdateItemStock } from '../dto/item';
import { getItemsFilter } from '../dto/item/filters';
import { Item } from '../models/items.model';
import { createItem } from '../services/item.service';
import fs from 'fs';

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
    stock,
    lowStock,
  } = req.body;

  const existingItem = await Item.findOne({ name: name });

  if (existingItem !== null)
    return res.json({ message: 'An item already exists with this name' });

  const uploader = async (path: string) => await upload(path, 'Zulu');

  const filePath = req.file?.path as string;
  const cloudImage = await uploader(filePath);

  fs.unlinkSync(filePath);

  const createItemService = await createItem({
    image: cloudImage.url,
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
    stock,
    lowStock,
  });

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  res.status(201).json(createItemService);
};

export const getItemsController = async (req: Request, res: Response) => {
  const { query, sortOptions } = getItemsFilter(req);

  try {
    const items = await Item.find(query).sort(sortOptions).populate('category');

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
};

export const getItemByIdController = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const item = await Item.findById(id);

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
};

export const updateItemPriceController = async (
  req: Request,
  res: Response
) => {
  const { costPrice, sellingPrice } = <UpdateItemPrice>req.body;

  const id = req.params.id;

  try {
    const existingItem = await Item.findById(id);

    if (existingItem !== null) {
      existingItem.costPrice = costPrice;
      existingItem.sellingPrice = sellingPrice;

      await existingItem.save();

      return res.json(existingItem);
    } else {
      return res.status(400).json({ message: 'Item does not exist' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateItemStockController = async (
  req: Request,
  res: Response
) => {
  const { stock, lowStock } = <UpdateItemStock>req.body;

  const id = req.params.id;

  try {
    const existingItem = await Item.findById(id);

    if (existingItem !== null) {
      existingItem.stock = stock;
      existingItem.lowStock = lowStock;

      await existingItem.save();

      return res.json(existingItem);
    } else {
      return res.status(400).json({ message: 'Item does not exist' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
