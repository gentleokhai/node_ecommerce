import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../config';
import { Request, Response } from 'express';
import { UserAuthPayload } from '../dto/user';

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = (payload: UserAuthPayload) => {
  return jwt.sign(payload, APP_SECRET, { expiresIn: '1d' });
};

export const ValidateSignature = async (req: Request, res: Response) => {
  const signature = req.get('Authorization');
  const { TokenExpiredError } = jwt;

  if (signature) {
    jwt.verify(signature.split(' ')[1], APP_SECRET, (err, payload) => {
      if (err instanceof TokenExpiredError) {
        return res
          .status(401)
          .send({ message: 'Unauthorized! Access Token was expired!' });
      }
      req.user = payload as UserAuthPayload;
    });
    return true;
  }
};
