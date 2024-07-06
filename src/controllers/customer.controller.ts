import { Request, Response } from 'express';
import { tryCatch } from '../utility/tryCatch';
import { AppError } from '../utility/AppError';
import { Customer } from '../models/customer.model';
import {
  CreateCustomerInput,
  UpdateCustomerInput,
} from '../dto/customer/types';
import { getCustomersFilter } from '../dto/customer/filters';
import { Notes } from '../models/notes.model';

export const FindCustomer = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Customer.findOne({ email: email });
  } else {
    return await Customer.findById(id);
  }
};

export const createCustomerController = tryCatch(
  async (req: Request<any, any, CreateCustomerInput>, res: Response) => {
    const { email, phoneNumber, firstName, lastName, gender, group } = req.body;

    const employeeId = req.user?.id;

    const existingUser = await FindCustomer('', email);

    if (existingUser !== null)
      throw new AppError('A customer already exists with this email', 400);

    const createdCustomer = await Customer.create({
      email,
      phoneNumber,
      firstName,
      lastName,
      gender,
      createdBy: employeeId,
      group,
    });

    res.status(201).json(createdCustomer);
  }
);

export const updateCustomerController = tryCatch(
  async (req: Request<any, any, UpdateCustomerInput>, res: Response) => {
    const { email, phoneNumber, firstName, lastName, gender, group } = req.body;

    const id = req.params.id;

    const existingCustomer = await FindCustomer(id);

    if (!existingCustomer) throw new AppError('Customer does not exist', 400);

    existingCustomer.firstName = firstName;
    existingCustomer.lastName = lastName;
    existingCustomer.email = email;
    existingCustomer.phoneNumber = phoneNumber;
    existingCustomer.gender = gender;
    existingCustomer.group = group as string;

    const updateCustomer = await existingCustomer.save();

    res.status(201).json(updateCustomer);
  }
);

export const getCustomersController = tryCatch(
  async (req: Request, res: Response) => {
    const { query } = getCustomersFilter(req);

    const customers = await Customer.find(query)
      .populate([
        {
          path: 'createdBy',
          select: 'firstName lastName id',
        },
        {
          path: 'group',
          select: 'name id',
        },
        {
          path: 'notes',
          select: 'note createdBy',
          populate: [
            {
              path: 'createdBy',
              select: 'firstName lastName id',
            },
          ],
        },
      ])
      .sort('-createdAt');

    res.status(200).json(customers);
  }
);

export const getCustomerByIdController = tryCatch(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const customer = await Customer.findById(id).populate([
      {
        path: 'createdBy',
        select: 'firstName lastName id',
      },
      {
        path: 'group',
        select: 'name id',
      },
    ]);

    res.status(200).json(customer);
  }
);

export const deleteCustomerController = tryCatch(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await Customer.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new AppError('Customer does not exist', 400);
    }

    return res.status(200).json({ message: 'Customer deleted successfully' });
  }
);

export const createNotesController = tryCatch(
  async (req: Request<any, any, { note: string }>, res: Response) => {
    const { note } = req.body;
    const employeeId = req.user?.id;

    const id = req.params.id;

    const notes = await Notes.create({
      note: note,
      createdBy: employeeId,
    });

    const existingCustomer = await FindCustomer(id);

    if (existingCustomer) {
      existingCustomer.notes = notes.id;

      existingCustomer.save();
    }

    res.status(201).json(notes);
  }
);
