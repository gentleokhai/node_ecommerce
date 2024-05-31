import express from 'express';
import {
  createEmployeeController,
  updateEmployeeStatusController,
  getEmployeeByIdController,
  getEmployeesController,
  updateEmployeeAccessController,
  updateEmployeeController,
  getMeController,
  updateEmployeeOnboardingController,
} from '../controllers/employee.controller';
import {
  createJobController,
  getJobsController,
} from '../controllers/jobs.controller';
import { AccessType } from '../dto/general';
import { Authenticate } from '../middlewares';
import { checkRole } from '../middlewares/checkRole';
import {
  createEmployeeValidator,
  updateEmployeeAccessValidator,
  updateEmployeeOnboardingValidator,
  updateEmployeeStatusValidator,
  updateEmployeeValidator,
} from '../validators/employee.validator';
import { createJobValidator } from '../validators/jobs.validator';

const router = express.Router();

router.use(Authenticate);
router.use(checkRole([AccessType.EXECUTIVE, AccessType.MANAGER]));

router.get('', getEmployeesController);
router.post('/jobs', createJobValidator, createJobController);
router.get('/jobs', getJobsController);
router.patch(
  '/onboarding',
  updateEmployeeOnboardingValidator,
  updateEmployeeOnboardingController
);
router.get('/me', getMeController);
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
