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

export interface EditUserInput {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  title: string;
  gender: string;
  role: string;
}

export interface ExistingUser {
  userId: string;
  email: string;
  password: string;
  salt: string;
}

export interface UserLoginPayload {
  email: string;
  password: string;
}

export interface UserAuthPayload {
  email: string;
  userId: string;
}
