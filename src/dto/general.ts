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
