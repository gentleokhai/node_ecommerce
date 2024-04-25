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
  try {
    await ValidateSignature(req, res);
    next();
  } catch (error) {
    next(error);
  }
};
