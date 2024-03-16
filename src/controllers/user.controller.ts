import { Request, Response, NextFunction } from 'express';
import { CreateUserInput, UpdateUserInput } from '../dto/user/types';
import { User } from '../models';
import { GeneratePassword, GenerateSalt } from '../utility';

export const FindUser = async (id: string | undefined, email?: string) => {
  if (email) {
    return await User.findOne({ email: email });
  } else {
    return await User.findOne({ id: id });
  }
};

export const CreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, phoneNumber, firstName, lastName, gender, role } = <
    CreateUserInput
  >req.body;

  const user = req.user;

  if (user) {
    const existingUser = await FindUser('', email);

    if (existingUser !== null)
      return res.json({ message: 'An account already exists with this email' });

    const salt = await GenerateSalt();
    const accountPassword = await GeneratePassword(password, salt);

    await User.create({
      email,
      password: accountPassword,
      phoneNumber,
      firstName,
      salt,
      lastName,
      gender,
      role,
    });

    const result = {
      email,
      firstName,
      lastName,
      gender,
      role,
      phoneNumber,
    };

    return res.json(result);
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  const { email, phoneNumber, firstName, lastName, gender, role } = <
    UpdateUserInput
  >req.body;

  const user = req.user;

  if (user) {
    try {
      const existingUser = await FindUser(user?.id);

      if (existingUser !== null) {
        existingUser.firstName = firstName;
        existingUser.lastName = lastName;
        // existingUser.email = email;
        // existingUser.phoneNumber = phoneNumber;
        existingUser.gender = gender;
        existingUser.role = role;

        await existingUser.save();

        const result = {
          firstName,
          lastName,
          email,
          gender,
          role,
          phoneNumber,
        };
        return res.json(result);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(400).json({ message: 'User information not found' });
};

export const associateUserWithCompany = async (
  userId: string,
  companyId: string
) => {
  try {
    await User.findByIdAndUpdate(userId, { company: companyId });
  } catch (err) {
    throw err;
  }
};
