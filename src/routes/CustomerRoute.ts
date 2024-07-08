import express from 'express';
import {
  createCustomerController,
  createNotesController,
  deleteCustomerController,
  deleteNotesController,
  getCustomerByIdController,
  getCustomersController,
  updateCustomerController,
  updateNotesController,
} from '../controllers/customer.controller';
import {
  createGroupController,
  getGroupController,
} from '../controllers/group.controller';
import { AccessType } from '../dto/general';
import { Authenticate } from '../middlewares';
import { checkRole } from '../middlewares/checkRole';
import {
  createCustomerValidator,
  updateCustomerValidator,
} from '../validators/customer.validator';
import { createGroupValidator } from '../validators/group.validator';

const router = express.Router();

router.use(Authenticate);
router.use(
  checkRole([AccessType.EXECUTIVE, AccessType.MANAGER, AccessType.CASHIER])
);
router.post('', createCustomerValidator, createCustomerController);
router.get('', getCustomersController);
router.post('/group', createGroupValidator, createGroupController);
router.get('/group', getGroupController);
router.get('/:id', getCustomerByIdController);
router.patch('/:id', updateCustomerValidator, updateCustomerController);
router.delete('/:id', deleteCustomerController);
router.post('/notes/:id', createNotesController);
router.patch('/notes/:id', updateNotesController);
router.delete('/notes/:id', deleteNotesController);

export { router as CustomerRoute };
