import express from 'express';
import {
  archiveItemController,
  createItemController,
  deleteItemController,
  getItemByIdController,
  getItemsController,
  updateItemController,
  updateItemPriceController,
  updateItemStockController,
} from '../controllers/item.controller';
import { Authenticate } from '../middlewares';
import {
  createCategoryController,
  getCategoryController,
} from '../controllers/category.controller';
import { createCategoryValidator } from '../validators/category.validator';
import {
  createItemValidator,
  updateItemPriceValidator,
  updateItemStockValidator,
  updateItemValidator,
} from '../validators/item.validator';

const router = express.Router();

router.use(Authenticate);
router.post('', createItemValidator, createItemController);
router.get('', getItemsController);
router.post('/category', createCategoryValidator, createCategoryController);
router.get('/category', getCategoryController);
router.get('/:id', getItemByIdController);
router.patch('/:id', updateItemValidator, updateItemController);
router.patch('/:id/price', updateItemPriceValidator, updateItemPriceController);
router.patch('/:id/stock', updateItemStockValidator, updateItemStockController);
router.patch('/:id/archive', archiveItemController);
router.delete('/:id', deleteItemController);

export { router as ItemRoute };
