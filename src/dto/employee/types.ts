export interface CreateEmployeeInput {
  email: string;
  phoneNumber: string;
  password: string;
  firstName: string;
  lastName: string;
  title: string;
  gender: string;
  role: string;
  jobTitle: string;
  dateOfEmployment: Date;
}

export interface UserLoginPayload {
  email: string;
  password: string;
}

export interface UserAuthPayload {
  email: string;
  id: string;
}
