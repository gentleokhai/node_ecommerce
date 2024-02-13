import { IsString, IsPhoneNumber, IsNotEmpty } from 'class-validator';
import { SignupPayload, SignInPayload } from './types';

export class SignupValidationSchema implements SignupPayload {
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class LoginValidationSchema implements SignInPayload {
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
