import express from 'express';
import {
  createEmployeeController,
  getEmployeeController,
} from '../controllers/employee.controller';
import { Authenticate } from '../middlewares';
import { createOrUpdateUserValidator } from '../validators/employer.validator';

const router = express.Router();

router.use(Authenticate);
router.get('', getEmployeeController);
router.post('', createEmployeeController);

export { router as EmployeeRoute };
