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
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  title: string;
  gender: string;
  role: string;
}
