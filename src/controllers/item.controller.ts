import { Request, Response, NextFunction } from 'express';
import { upload } from '../config/cloudinary';
import { CreateItem, UpdateItemPrice, UpdateItemStock } from '../dto/item';
import { getItemsFilter } from '../dto/item/filters';
import { Item } from '../models/items.model';
import { createItem } from '../services/item.service';
import { tryCatch } from '../utility/tryCatch';
import { AppError } from '../utility/AppError';

export const createItemController = tryCatch(
  async (req: Request<any, any, CreateItem>, res: Response) => {
    const {
      image,
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
      throw new AppError('An item already exists with this name', 400);

    const buffer = Buffer.from(image ?? '', 'base64');

    const uploader = async (path: any) => await upload(path, 'Zulu', res);

    const cloudImage = await uploader(buffer);

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

    res.status(201).json(createItemService);
  }
);

export const getItemsController = tryCatch(
  async (req: Request, res: Response) => {
    const { query, sortOptions } = getItemsFilter(req);

    const items = await Item.find(query).sort(sortOptions).populate('category');

    res.status(200).json(items);
  }
);

export const getItemByIdController = tryCatch(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const item = await Item.findById(id);

    res.status(200).json(item);
  }
);

export const updateItemPriceController = tryCatch(
  async (req: Request, res: Response) => {
    const { costPrice, sellingPrice } = <UpdateItemPrice>req.body;

    const id = req.params.id;

    const existingItem = await Item.findById(id);

    if (existingItem !== null) {
      existingItem.costPrice = costPrice;
      existingItem.sellingPrice = sellingPrice;

      await existingItem.save();

      return res.json(existingItem);
    } else {
      throw new AppError('Item does not exist', 400);
    }
  }
);

export const updateItemStockController = tryCatch(
  async (req: Request, res: Response) => {
    const { stock, lowStock } = <UpdateItemStock>req.body;

    const id = req.params.id;

    const existingItem = await Item.findById(id);

    if (existingItem !== null) {
      existingItem.stock = stock;
      existingItem.lowStock = lowStock;

      await existingItem.save();

      return res.json(existingItem);
    } else {
      throw new AppError('Item does not exist', 400);
    }
  }
);
