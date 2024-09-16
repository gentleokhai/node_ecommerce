import { Request, Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import {
  CreateItemValidationSchema,
  RestockItemStockValidationSchema,
  UpdateItemPriceValidationSchema,
  UpdateItemStockValidationSchema,
  UpdateItemValidationSchema,
} from '../dto/item/item.dto';
import {
  CreateItem,
  RestockPayload,
  UpdateItem,
  UpdateItemPrice,
  UpdateItemStock,
} from '../dto/item';
import { AppError } from '../utility/AppError';

export const createItemValidator = async (
  req: Request<any, any, CreateItem>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new AppError('Missing request body!', 400);
    }

    const {
      image,
      name,
      category,
      unit,
      sku,
      weight,
      description,
      costPrice,
      sellingPrice,
      wholesalePrice,
      quantityInPack,
      stock,
      lowStock,
    } = req.body;

    const item = new CreateItemValidationSchema();
    item.image = image ?? '';
    item.name = name;
    item.category = category;
    item.sku = sku;
    item.weight = weight;
    item.unit = unit;
    item.description = description;
    item.costPrice = costPrice;
    item.sellingPrice = sellingPrice;
    item.wholesalePrice = wholesalePrice;
    item.quantityInPack = quantityInPack;
    item.stock = stock;
    item.lowStock = lowStock;

    await validateOrReject(item);

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

export const updateItemValidator = async (
  req: Request<any, any, UpdateItem>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new AppError('Missing request body!', 400);
    }

    const { image, name, category, unit, sku, weight, description } = req.body;

    const item = new UpdateItemValidationSchema();
    item.image = image ?? '';
    item.name = name;
    item.category = category;
    item.sku = sku;
    item.weight = weight;
    item.unit = unit;
    item.description = description;

    await validateOrReject(item);

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

export const updateItemPriceValidator = async (
  req: Request<any, any, UpdateItemPrice>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new AppError('Missing request body!', 400);
    }

    const { costPrice, sellingPrice } = req.body;

    const item = new UpdateItemPriceValidationSchema();
    item.costPrice = costPrice;
    item.sellingPrice = sellingPrice;

    await validateOrReject(item);

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

export const updateItemStockValidator = async (
  req: Request<any, any, UpdateItemStock>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new AppError('Missing request body!', 400);
    }

    const { stock, lowStock } = req.body;

    const item = new UpdateItemStockValidationSchema();
    item.stock = stock;
    item.lowStock = lowStock;

    await validateOrReject(item);

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

export const restockItemStockValidator = async (
  req: Request<any, any, RestockPayload>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new AppError('Missing request body!', 400);
    }

    const { items } = req.body;

    const restockItem = new RestockItemStockValidationSchema();
    restockItem.items = items;

    await validateOrReject(restockItem);

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
