export interface SignupPayload {
  email: string;
  phoneNumber: string;
  password: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  password: string;
  confirmPassword: string;
}
