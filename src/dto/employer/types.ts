export interface CreateEmployerInput {
  email: string;
  phoneNumber: string;
  password: string;
  firstName: string;
  lastName: string;
  title: string;
  gender: string;
  role: string;
}

export interface UpdateEmployerInput {
  firstName: string;
  lastName: string;
  gender: string;
  role: string;
}
