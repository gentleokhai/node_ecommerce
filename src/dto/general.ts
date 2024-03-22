import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Types } from 'mongoose';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHERS = 'others',
}

export enum Status {
  ACTIVE = 'Active',
  DEACTIVATED = 'Deactivated',
  INVITED = 'Invited',
}

export interface ExistingUser {
  id: string;
  email: string;
  password: string;
  salt: string;
}

@ValidatorConstraint({ name: 'isValidMongoId', async: false })
export class IsValidMongoId implements ValidatorConstraintInterface {
  validate(id: any, args: ValidationArguments) {
    return Types.ObjectId.isValid(id);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid MongoDB ObjectID`;
  }
}
