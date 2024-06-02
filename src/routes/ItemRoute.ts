import express from 'express';
import {
  archiveItemController,
  createItemController,
  deleteItemController,
  getItemByIdController,
  getItemsController,
  getPOSItemsController,
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
import { AccessType } from '../dto/general';
import { checkRole } from '../middlewares/checkRole';

const router = express.Router();

router.use(Authenticate);
router.get('/pos', getPOSItemsController);
router.get('/category', getCategoryController);

router.use(checkRole([AccessType.EXECUTIVE, AccessType.MANAGER]));

router.post('', createItemValidator, createItemController);
router.get('', getItemsController);
router.post('/category', createCategoryValidator, createCategoryController);
router.get('/:id', getItemByIdController);
router.patch('/:id', updateItemValidator, updateItemController);
router.patch('/:id/price', updateItemPriceValidator, updateItemPriceController);
router.patch('/:id/stock', updateItemStockValidator, updateItemStockController);
router.patch('/:id/archive', archiveItemController);
router.delete('/:id', deleteItemController);

export { router as ItemRoute };
