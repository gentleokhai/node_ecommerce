import { Request, Response, NextFunction } from 'express';
import { AccessType } from '../dto/general';
import { Employee } from '../models';

export const checkRole =
  (accessType: AccessType[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const employee = await Employee.findById(userId);

    if (!employee || !accessType.includes(employee.accessType as AccessType)) {
      return res
        .status(401)
        .json({ message: 'Sorry, you do not have access to this route' });
    }

    next();
  };
