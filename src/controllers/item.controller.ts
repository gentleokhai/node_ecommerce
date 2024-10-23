import { Request, Response, NextFunction } from 'express';
import { upload } from '../config/cloudinary';
import {
  CreateItem,
  UpdateItemPrice,
  UpdateItemStock,
  UpdateItem,
  RestockPayload,
  UploadItem,
  CreateUploadedItem,
  CreateUploadPayload,
} from '../dto/item';
import { getItemsFilter } from '../dto/item/filters';
import { Item } from '../models/items.model';
import { createItem } from '../services/item.service';
import { tryCatch } from '../utility/tryCatch';
import { AppError } from '../utility/AppError';
import {
  convertNGNToUSD,
  convertToCurrency,
  convertToUSD,
} from '../services/exchangeRate.service';
import { roundUp } from '../utility/helpers';
import fs from 'fs';
import csv from 'csv-parser';
import { Category } from '../models/category.model';

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
      costPrice,
      sellingPrice,
      wholesalePrice,
      quantityInPack,
      stock,
      lowStock,
    } = req.body;

    const company = req.company;

    const existingItem = await Item.findOne({
      name: name,
      company: company?._id,
    });

    if (existingItem !== null)
      throw new AppError('An item already exists with this name', 400);

    if (Number(costPrice) > Number(sellingPrice)) {
      throw new AppError(
        `Cost price cannot be greater than Selling price for item`,
        400
      );
    }

    if (Number(lowStock) > Number(stock)) {
      throw new AppError(
        `Low stock cannot be greater than opening stock for item`,
        400
      );
    }

    const buffer = Buffer.from(image ?? '', 'base64');

    const uploader = async (path: any) => await upload(path, 'Zulu', res);

    const cloudImage = await uploader(buffer);

    const convertedCostPrice = await convertToUSD(
      costPrice,
      company?.buyingCurrency as string
    );
    const convertedSellingPrice = await convertToUSD(
      sellingPrice,
      company?.buyingCurrency as string
    );

    const convertedWholesalePrice = await convertToUSD(
      wholesalePrice as number,
      company?.buyingCurrency as string
    );

    const createItemService = await createItem({
      image: cloudImage.url,
      name,
      category,
      unit,
      sku,
      weight,
      description,
      costPrice: convertedCostPrice,
      sellingPrice: convertedSellingPrice,
      wholesalePrice: wholesalePrice ? convertedWholesalePrice : null,
      quantityInPack,
      stock,
      lowStock,
      company: company?._id,
    });

    res.status(201).json(createItemService);
  }
);

export const getItemsController = tryCatch(
  async (req: Request, res: Response) => {
    const { query, sortOptions } = getItemsFilter(req);

    const company = req.company;

    const viewingCurrency = company?.viewingCurrency || 'USD';

    const page = parseInt(req.query.page as string, 10) || 1;
    const pagePerLimit = parseInt(req.query.pagePerLimit as string, 10) || 10;

    const startIndex = (page - 1) * pagePerLimit;
    const endIndex = page * pagePerLimit;

    query.company = company?._id;

    const items = await Item.find(query).sort(sortOptions).populate('category');

    const paginatedItems = items.slice(startIndex, endIndex);

    const convertedItems = await Promise.all(
      paginatedItems.map(async (item) => {
        item.costPrice = roundUp(
          await convertToCurrency(item.costPrice, viewingCurrency)
        );
        item.sellingPrice = roundUp(
          await convertToCurrency(item.sellingPrice, viewingCurrency)
        );
        item.wholesalePrice = roundUp(
          await convertToCurrency(item.wholesalePrice, viewingCurrency)
        );
        item.currency = viewingCurrency;
        return item;
      })
    );

    const totalPages = Math.ceil(items.length / pagePerLimit);
    const totalItems = items.length - 1;

    const nextPage = page < totalPages ? page + 1 : null;
    const previousPage = page > 1 ? page - 1 : null;
    const currentPage = page;

    res.status(200).json({
      items: convertedItems,
      totalPages,
      pagePerLimit,
      totalItems,
      nextPage,
      previousPage,
      currentPage,
    });
  }
);

export const getItemByIdController = tryCatch(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const company = req.company;

    const viewingCurrency = company?.viewingCurrency || 'USD';

    const item = await Item.findOne({
      _id: id,
      company: company?._id,
    });

    const convertedItem = {
      ...item?.toObject(),
      costPrice: roundUp(
        await convertToCurrency(item?.costPrice as number, viewingCurrency)
      ),
      sellingPrice: roundUp(
        await convertToCurrency(item?.sellingPrice as number, viewingCurrency)
      ),
      wholesalePrice: roundUp(
        await convertToCurrency(item?.wholesalePrice as number, viewingCurrency)
      ),
      currency: viewingCurrency,
    };

    res.status(200).json(convertedItem);
  }
);

export const updateItemController = tryCatch(
  async (req: Request, res: Response) => {
    const { image, name, category, unit, sku, weight, description } = <
      UpdateItem
    >req.body;

    const id = req.params.id;

    const existingItem = await Item.findById(id);

    if (existingItem !== null) {
      if (
        typeof image === 'string' &&
        image.startsWith('https://res.cloudinary.com')
      ) {
        existingItem.image = image;
      } else {
        const buffer = Buffer.from(image ?? '', 'base64');
        const uploader = async (path: any) => await upload(path, 'Zulu', res);
        const cloudImage = await uploader(buffer);
        existingItem.image = cloudImage.url as string;
      }

      name && (existingItem.name = name);
      category && (existingItem.category = category);
      unit && (existingItem.unit = unit);
      sku && (existingItem.sku = sku);
      weight && (existingItem.weight = weight);
      description && (existingItem.description = description);

      await existingItem.save();

      return res.json(existingItem);
    } else {
      throw new AppError('Item does not exist', 400);
    }
  }
);

export const updateItemPriceController = tryCatch(
  async (req: Request, res: Response) => {
    const { costPrice, sellingPrice } = <UpdateItemPrice>req.body;

    const id = req.params.id;

    const existingItem = await Item.findById(id);

    const convertedCostPrice = await convertNGNToUSD(costPrice);
    const convertedSellingPrice = await convertNGNToUSD(sellingPrice);

    if (existingItem !== null) {
      existingItem.costPrice = convertedCostPrice;
      existingItem.sellingPrice = convertedSellingPrice;

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

export const deleteItemController = tryCatch(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await Item.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new AppError('Item does not exist', 400);
    }

    return res.json({ message: 'Item deleted successfully' });
  }
);

export const archiveItemController = tryCatch(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const existingItem = await Item.findById(id);

    if (existingItem !== null) {
      existingItem.archived = !existingItem.archived;

      await existingItem.save();

      return res.json(existingItem);
    } else {
      throw new AppError('Item does not exist', 400);
    }
  }
);

export const getPOSItemsController = tryCatch(
  async (req: Request, res: Response) => {
    const { query, sortOptions } = getItemsFilter(req);

    const company = req.company;

    const viewingCurrency = company?.viewingCurrency ?? '';

    const items = await Item.find({
      ...query,
      archived: false,
      company: company?._id,
    })
      .sort(sortOptions)
      .populate('category');

    const convertedItems = await Promise.all(
      items.map(async (item) => {
        item.costPrice = roundUp(
          await convertToCurrency(item.costPrice, viewingCurrency)
        );
        item.sellingPrice = roundUp(
          await convertToCurrency(item.sellingPrice, viewingCurrency)
        );
        item.wholesalePrice = roundUp(
          await convertToCurrency(item.wholesalePrice, viewingCurrency)
        );
        item.currency = viewingCurrency;
        return item;
      })
    );

    res.status(200).json(convertedItems);
  }
);

export const restockItemsController = tryCatch(
  async (req: Request<any, any, RestockPayload>, res: Response) => {
    const { items } = req.body;

    for (const transactionItem of items) {
      const item = await Item.findById(transactionItem.item);

      if (item) {
        item.stock += Number(transactionItem.numberOfItems);

        if (item.stock < 0) {
          throw new AppError(`Insufficient stock for item: ${item.name}`, 400);
        }

        await item.save();
        res.status(201).json({ message: 'Stock updated' });
      } else {
        throw new AppError(
          `Item with ID ${transactionItem.item} not found`,
          400
        );
      }
    }
  }
);

export const createItemsFromUploadController = tryCatch(
  async (req: Request<any, any, CreateUploadPayload>, res: Response) => {
    const company = req.company;

    for (const row of req.body.items) {
      const {
        image,
        name,
        category,
        unit,
        sku,
        costPrice,
        sellingPrice,
        wholesalePrice,
        stock,
        lowStock,
      } = row;

      const existingItem = await Item.findOne({
        name: name,
        company: company?._id,
      });

      if (existingItem !== null) {
        throw new AppError(
          `An item already exists with the name: ${name}`,
          400
        );
      }

      if (Number(costPrice) > Number(sellingPrice)) {
        throw new AppError(
          `Cost price cannot be greater than Selling price for item: ${name}`,
          400
        );
      }

      if (Number(lowStock) > Number(stock)) {
        throw new AppError(
          `Low stock cannot be greater than opening stock for item: ${name}`,
          400
        );
      }

      const convertedCostPrice = await convertToUSD(
        parseFloat(costPrice),
        company?.buyingCurrency as string
      );

      const convertedSellingPrice = await convertToUSD(
        parseFloat(sellingPrice),
        company?.buyingCurrency as string
      );

      const convertedWholesalePrice = wholesalePrice
        ? await convertToUSD(
            parseFloat(wholesalePrice),
            company?.buyingCurrency as string
          )
        : undefined;

      console.log(convertedWholesalePrice);

      const isCategoryAvailable = await Category.findOne({
        name: category,
      });

      let categoryId;

      if (!isCategoryAvailable) {
        const createdCategory = await Category.create({
          name: category,
          company: company?._id,
        });
        categoryId = createdCategory._id;
      } else {
        categoryId = isCategoryAvailable._id;
      }

      await Item.create({
        image: image,
        name,
        category: categoryId,
        unit,
        sku,
        costPrice: convertedCostPrice,
        sellingPrice: convertedSellingPrice,
        wholesalePrice: convertedWholesalePrice,
        stock: parseInt(stock, 10),
        lowStock: parseInt(lowStock, 10),
        company: company?._id,
      });
    }

    res.status(201).json({ message: 'Items created' });
  }
);
