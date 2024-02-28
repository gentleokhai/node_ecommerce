import { IsString, IsPhoneNumber, IsNotEmpty } from 'class-validator';
import { SignupPayload, SignInPayload } from './types';

export class SignupValidationSchema implements SignupPayload {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  constructor(email: string, phoneNumber: string, password: string) {
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.password = password;
  }
}

export class LoginValidationSchema implements SignInPayload {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
