export interface CreateUserInput {
  email: string;
  phoneNumber: string;
  password: string;
  firstName: string;
  lastName: string;
  title: string;
  gender: string;
  role: string;
}

export interface ExistingUser {
  id: string;
  email: string;
  password: string;
  salt: string;
}

export interface UserLoginPayload {
  email: string;
  password: string;
}

export interface UserAuthPayload {
  id: string;
  email: string;
}
