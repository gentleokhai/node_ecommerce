import { Request, Response, NextFunction } from 'express';
import { CreateAccountInput } from '../dto/Account.dto';
import { Account } from '../models';
import { GeneratePassword, GenerateSalt } from '../utility';

export const FindAccount = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Account.findOne({ email: email });
  } else {
    return await Account.findById(id);
  }
};

export const CreateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, phoneNumber, currency } = <CreateAccountInput>(
    req.body
  );

  const existingAccount = await FindAccount('', email);

  if (existingAccount !== null)
    return res.json({ message: 'An account already exists with this email' });

  const salt = await GenerateSalt();
  const accountPassword = await GeneratePassword(password, salt);

  const createdAccount = await Account.create({
    email,
    password: accountPassword,
    phoneNumber,
    salt,
    currency,
  });

  return res.json(createdAccount);
};
