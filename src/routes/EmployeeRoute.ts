import express from 'express';
import {
  createEmployeeController,
  updateEmployeeStatusController,
  getEmployeeByIdController,
  getEmployeesController,
  updateEmployeeAccessController,
  updateEmployeeController,
} from '../controllers/employee.controller';
import { Authenticate } from '../middlewares';
import {
  createEmployeeValidator,
  updateEmployeeAccessValidator,
  updateEmployeeStatusValidator,
  updateEmployeeValidator,
} from '../validators/employee.validator';

const router = express.Router();

router.use(Authenticate);
router.get('', getEmployeesController);
router.get('/:id', getEmployeeByIdController);
router.post('', createEmployeeValidator, createEmployeeController);
router.patch('/:id', updateEmployeeValidator, updateEmployeeController);
router.patch(
  '/access/:id',
  updateEmployeeAccessValidator,
  updateEmployeeAccessController
);
router.patch(
  '/status/:id',
  updateEmployeeStatusValidator,
  updateEmployeeStatusController
);

export { router as EmployeeRoute };
