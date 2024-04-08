export interface CreateEmployeeInput {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  status: string;
  accessType: string;
  jobTitle: string;
  dateOfEmployment: string;
  company: string;
}

export interface UpdateEmployeeAccessInput {
  accessType: string;
}

export interface UpdateEmployeeStatusInput {
  status: string;
}

export interface UpdateEmployeeInput {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
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
  keyword?: string;
}

export type SortOrder = 1 | -1;

export interface SortOptions {
  createdAt: number;
  firstName: 'asc' | 'desc';
}
