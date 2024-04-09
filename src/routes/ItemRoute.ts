import express from 'express';
import multer from 'multer';
import {
  createItemController,
  getItemByIdController,
  getItemsController,
  updateItemPriceController,
  updateItemStockController,
} from '../controllers/item.controller';
import { Authenticate } from '../middlewares';
import path from 'path';
import {
  createCategoryController,
  getCategoryController,
} from '../controllers/category.controller';
import { createCategoryValidator } from '../validators/category.validator';
import { createItemValidator } from '../validators/item.validator';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '../../src/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

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
