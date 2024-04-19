import { Request, Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import { CreateItemValidationSchema } from '../dto/item/item.dto';
import { CreateItem } from '../dto/item';

export const createItemValidator = async (
  req: Request<any, any, CreateItem>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: 'Missing request body!' });
    }

    const {
      image,
      name,
      category,
      unit,
      sku,
      weight,
      currency,
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
    item.currency = currency;
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
