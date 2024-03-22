export interface CreateEmployeeInput {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  role: string;
  jobTitle: string;
  dateOfEmployment: string;
  company: string;
}

export interface UpdateEmployeeInput {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  role: string;
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
