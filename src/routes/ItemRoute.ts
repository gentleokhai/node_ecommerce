import express from 'express';
import {
  createItemController,
  getItemByIdController,
  getItemsController,
  updateItemPriceController,
  updateItemStockController,
} from '../controllers/item.controller';
import { Authenticate } from '../middlewares';
import {
  createCategoryController,
  getCategoryController,
} from '../controllers/category.controller';
import { createCategoryValidator } from '../validators/category.validator';
import { createItemValidator } from '../validators/item.validator';
import { upload } from '../config/multer';

const router = express.Router();

router.use(Authenticate);
router.post(
  '',
  upload.single('image'),
  createItemValidator,
  createItemController
);
router.get('', getItemsController);
router.post('/category', createCategoryValidator, createCategoryController);
router.get('/category', getCategoryController);
router.get('/:id', getItemByIdController);
router.patch('/:id/price', updateItemPriceController);
router.patch('/:id/stock', updateItemStockController);

export { router as ItemRoute };
