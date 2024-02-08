import { UserAuthPayload } from '../dto/User.dto';
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
  const validate = await ValidateSignature(req);

  if (validate) {
    next();
  } else {
    return res.json({ message: 'User not authorized' });
  }
};
