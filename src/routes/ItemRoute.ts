import express from 'express';
import {
  archiveItemController,
  createItemController,
  createItemsByCSVs,
  deleteItemController,
  getItemByIdController,
  getItemsController,
  getPOSItemsController,
  restockItemsController,
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
  restockItemStockValidator,
  updateItemPriceValidator,
  updateItemStockValidator,
  updateItemValidator,
} from '../validators/item.validator';
import { AccessType } from '../dto/general';
import { checkRole } from '../middlewares/checkRole';
import { validateCompany } from '../middlewares/validateCompany';
import multer from 'multer';

const router = express.Router();

const upload = multer({ dest: '../../src/uploads' });

router.use(Authenticate);
router.use(validateCompany);

router.get('/pos', getPOSItemsController);
router.get('/category', getCategoryController);
router.patch('/restock', restockItemStockValidator, restockItemsController);

router.use(checkRole([AccessType.EXECUTIVE, AccessType.MANAGER]));

router.post('', createItemValidator, createItemController);
router.get('', getItemsController);
router.post('/category', createCategoryValidator, createCategoryController);
router.post('/upload', upload.single('file'), createItemsByCSVs);
router.get('/:id', getItemByIdController);
router.patch('/:id', updateItemValidator, updateItemController);
router.patch('/:id/price', updateItemPriceValidator, updateItemPriceController);
router.patch('/:id/stock', updateItemStockValidator, updateItemStockController);
router.patch('/:id/archive', archiveItemController);
router.delete('/:id', deleteItemController);

export { router as ItemRoute };
