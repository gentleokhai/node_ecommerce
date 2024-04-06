import express from 'express';
import multer from 'multer';
import { createItemController } from '../controllers/item.controller';
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

export { router as ItemRoute };
