import express from 'express';
import {
  createEmployeeController,
  getEmployeeByIdController,
  getEmployeesController,
  updateEmployeeController,
} from '../controllers/employee.controller';
import { Authenticate } from '../middlewares';
import {
  createEmployeeValidator,
  updateEmployeeValidator,
} from '../validators/employee.validator';

const router = express.Router();

router.use(Authenticate);
router.get('', getEmployeesController);
router.get('/:id', getEmployeeByIdController);
router.post('', createEmployeeValidator, createEmployeeController);
router.patch('/:id', updateEmployeeValidator, updateEmployeeController);

export { router as EmployeeRoute };
