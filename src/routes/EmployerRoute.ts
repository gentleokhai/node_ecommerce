import express from 'express';
import {
  getEmployerController,
  updateEmployerController,
} from '../controllers/employer.controller';
import { Authenticate } from '../middlewares';
import { createOrUpdateEmployerValidator } from '../validators/employer.validator';

const router = express.Router();

router.use(Authenticate);
router.patch('', createOrUpdateEmployerValidator, updateEmployerController);
router.get('', getEmployerController);

export { router as EmployerRoute };
