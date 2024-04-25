import { Request, Response, NextFunction } from 'express';

type ControllerFunction = (
  req: Request,
  res: Response
) => Promise<Response<any, Record<string, any>>> | Promise<void>;

export const tryCatch =
  (controller: ControllerFunction) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res);
    } catch (error) {
      next(error);
    }
  };
