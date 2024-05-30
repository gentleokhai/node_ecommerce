import { CreateEmployeeInput } from '../dto/employee';
import { Employee } from '../models';

export const FindEmployee = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Employee.findOne({ email: email });
  } else {
    return await Employee.findOne({ id: id });
  }
};

export const createEmployee = async (data: CreateEmployeeInput) => {
  const {
    email,
    phoneNumber,
    firstName,
    lastName,
    gender,
    accessType,
    jobTitle,
    status,
    dateOfEmployment,
    company,
  } = data;

  const createdUser = await Employee.create({
    email,
    phoneNumber,
    firstName,
    lastName,
    gender,
    accessType,
    jobTitle,
    dateOfEmployment,
    company,
    status,
  });

  return createdUser;
};
