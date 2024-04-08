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
router.post('', upload.single('image'), createItemController);
router.get('', getItemsController);
router.get('/:id', getItemByIdController);
router.patch('/:id/price', updateItemPriceController);
router.patch('/:id/stock', updateItemStockController);

export { router as ItemRoute };
