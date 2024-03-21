import { IsString, IsPhoneNumber, IsOptional, IsEmail } from 'class-validator';
import { UpdateEmployerInput } from './types';

export class UpdateEmployerValidationSchema implements UpdateEmployerInput {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @IsOptional()
  gender: string;

  constructor(
    email: string,
    phoneNumber: string,
    password: string,
    firstName: string,
    lastName: string,
    title: string,
    role: string,
    gender: string
  ) {
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.title = title;
    this.role = role;
    this.gender = gender;
  }
}
