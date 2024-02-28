import { SignupPayload, SignInPayload } from '../dto/auth';
import { ExistingUser } from '../dto/user';
import { User } from '../models';
import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} from '../utility';

export const signup = async (data: SignupPayload) => {
  const { email, password, phoneNumber } = data;

  const salt = await GenerateSalt();
  const accountPassword = await GeneratePassword(password, salt);

  const createdUser = await User.create({
    email,
    password: accountPassword,
    phoneNumber,
    salt,
  });

  const signature = GenerateSignature({
    userId: createdUser.userId,
    email: email,
  });

  const result = {
    userId: createdUser.userId,
    email: email,
    token: signature,
  };

  return result;
};

export const login = async (
  data: SignInPayload,
  existingUser: ExistingUser
) => {
  const { password } = data;

  const validation = await ValidatePassword(
    password,
    existingUser.password,
    existingUser.salt
  );

  if (validation) {
    const signature = GenerateSignature({
      userId: existingUser.userId,
      email: existingUser.email,
    });

    return { token: signature, isValidated: true };
  }
  return { isValidated: false };
};
