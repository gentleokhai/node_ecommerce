import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Types } from 'mongoose';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHERS = 'OTHERS',
}

export enum AccessType {
  NOACCESS = 'NOACCESS',
  CASHIER = 'CASHIER',
  MANAGER = 'MANAGER',
  EXECUTIVE = 'EXECUTIVE',
}

export enum Status {
  ACTIVE = 'ACTIVE',
  DEACTIVATED = 'DEACTIVATED',
  INVITED = 'INVITED',
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

export function IsEnumValue(
  enumType: any,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEnumValue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Object.values(enumType).includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid enum value`;
        },
      },
    });
  };
}
