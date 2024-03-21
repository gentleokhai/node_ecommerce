import express from 'express';
import { updateEmployerController } from '../controllers/employer.controller';
import { Authenticate } from '../middlewares';
import { createOrUpdateUserValidator } from '../validators/employer.validator';

const router = express.Router();

router.use(Authenticate);
router.patch('', createOrUpdateUserValidator, updateEmployerController);

export { router as EmployerRoute };
