import { AccessType, Gender, Status } from '../general';

export interface CreateEmployeeInput {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  accessType: AccessType;
  jobTitle: string;
  dateOfEmployment: string;
  company: string;
}

export interface UpdateEmployeeOnboardingInput {
  firstName: string;
  lastName: string;
  gender: Gender;
}

export interface UpdateEmployeeAccessInput {
  accessType: AccessType;
}

export interface UpdateEmployeeStatusInput {
  status: Status;
}

export interface UpdateEmployeeInput {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  jobTitle: string;
  dateOfEmployment: string;
}

export interface UserLoginPayload {
  email: string;
  password: string;
}

export interface UserAuthPayload {
  email: string;
  id: string;
}

export interface FilterTypes {
  accessType?: { $in: string[] };
  status?: { $in: string[] };
  job?: { $in: string[] };
  keyword?: string;
}

export type SortOrder = 1 | -1;

export interface SortOptions {
  createdAt: number;
  firstName: 'asc' | 'desc';
}
