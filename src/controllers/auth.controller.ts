import { Request, Response, NextFunction } from 'express';
import { ChangePasswordPayload, forgotPasswordPayload } from '../dto/auth';
import { Company, Employee } from '../models';
import { login, signup } from '../services';
import { AppError } from '../utility/AppError';
import { tryCatch } from '../utility/tryCatch';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { GeneratePassword, GenerateSalt } from '../utility';
import { Status } from '../dto/general';
import { generateToken } from '../utility/generate-token';
import sendEmail from '../utility/mailer';

dotenv.config();

const findEmployee = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Employee.findOne({ email: email });
  } else {
    return await Employee.findOne({ id: id });
  }
};

export const signupController = tryCatch(
  async (req: Request, res: Response) => {
    const existingEmployee = await findEmployee('', req.body.email);

    if (existingEmployee !== null)
      throw new AppError('An account already exists with this email', 400);

    const signupService = await signup(req.body);
    return res.status(201).json(signupService);
  }
);

export const loginController = tryCatch(async (req: Request, res: Response) => {
  const existingEmployee = await findEmployee('', req.body.email);

  const existingCompany = await Company.findById(existingEmployee?.company);

  console.log(existingEmployee?.company);
  console.log(existingCompany);

  if (existingEmployee !== null) {
    const loginService = await login(req.body, {
      id: existingEmployee.id,
      email: existingEmployee.email,
      password: existingEmployee.password,
      salt: existingEmployee.salt,
    });

    if (loginService.isValidated) {
      res.status(200).json({
        token: loginService.token,
        accessType: existingEmployee.accessType,
        companyId: existingEmployee.company,
        viewingCurrency: existingCompany?.viewingCurrency,
      });
    } else {
      throw new AppError('Login credentials are not valid', 400);
    }
  } else {
    throw new AppError('Login credentials are not valid', 400);
  }
});

export const changePasswordController = tryCatch(
  async (req: Request<any, any, ChangePasswordPayload>, res: Response) => {
    const { token } = req.query;

    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      throw new AppError('Passwords do not match', 400);
    }

    if (!token) {
      throw new AppError('Invalid token', 400);
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token as string, process.env.JWT_SECRET as string);
    } catch (err) {
      throw new AppError('Invalid or expired token', 400);
    }

    const employee = await Employee.findOne({ email: decoded.email });

    if (!employee) {
      throw new AppError('Invalid token or user not found', 400);
    }

    if (employee.tokenExpiration && employee.tokenExpiration < new Date()) {
      throw new AppError('Token has expired', 400);
    }

    const salt = await GenerateSalt();
    const accountPassword = await GeneratePassword(password, salt);

    employee.verified = true;
    employee.verificationToken = undefined;
    employee.tokenExpiration = undefined;
    employee.password = accountPassword;
    employee.status = Status.ACTIVE;
    employee.salt = salt;
    await employee.save();

    res.status(200).json({ message: 'Password Created' });
  }
);

export const forgotPasswordController = tryCatch(
  async (req: Request<any, any, forgotPasswordPayload>, res: Response) => {
    const { email } = req.body;

    const existingEmployee = await Employee.findOne({ email: email });

    const token = generateToken(email);

    const verificationLink = `${process.env.CLIENT_URL}/auth/new-password?token=${token}`;

    if (existingEmployee) {
      existingEmployee.verificationToken = token;
      existingEmployee.tokenExpiration = new Date(Date.now() + 3600000);

      await sendEmail({
        to: existingEmployee.email,
        from: 'Uche from Zulu',
        subject: 'ZULU RESET PASSWORD',
        template: 'forgotPassword',
        verificationLink,
      }).catch((error) => {
        console.log(error);
        throw new AppError(
          'Failed to send email. Please try again later.',
          500
        );
      });

      res.status(200).json({ message: 'Email Sent' });
    } else {
      res.status(200).json({ message: 'Email Sent' });
    }
  }
);
