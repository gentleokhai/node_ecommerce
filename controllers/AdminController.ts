import { Request, Response, NextFunction } from 'express';
import { CreateAdminInput } from '../dto/Admin.dto';

export const CreateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, phoneNumber, currency } = <CreateAdminInput>req.body;
};
