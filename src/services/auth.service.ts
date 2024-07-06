import { SignupPayload, SignInPayload } from '../dto/auth';
import { AccessType, ExistingUser } from '../dto/general';
import { Employee } from '../models';
import { Jobs } from '../models/jobs.model';
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

  let ownerJob = await Jobs.findOne({ name: 'Owner' });
  if (!ownerJob) {
    ownerJob = await Jobs.create({ name: 'Owner' });
  }

  const createdEmployee = await Employee.create({
    email,
    password: accountPassword,
    phoneNumber,
    salt,
    accessType: AccessType.EXECUTIVE,
    status: 'ACTIVE',
    jobTitle: ownerJob.id,
  });

  const signature = GenerateSignature({
    id: createdEmployee.id,
    email: email,
  });

  const result = {
    id: createdEmployee.id,
    email: email,
    token: signature,
    accessType: createdEmployee.accessType,
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
      id: existingUser.id,
      email: existingUser.email,
    });

    return { token: signature, isValidated: true };
  }

  return { isValidated: false };
};
