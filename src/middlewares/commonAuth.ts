import { UserAuthPayload } from '../dto/employee/types';
import { Request, Response, NextFunction } from 'express';
import { ValidateSignature } from '../utility';

declare global {
  namespace Express {
    interface Request {
      user?: UserAuthPayload;
    }
  }
}

export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = await ValidateSignature(req, res);

  if (validate) {
    next();
  } else {
    return res.status(401).json({ message: 'User not authorized' });
  }
};
