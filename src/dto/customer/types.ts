export interface CreateCustomerInput {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  group?: string;
}

export interface UpdateCustomerInput {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  group?: string;
}

export interface FilterTypes {
  accessType?: { $in: string[] };
  status?: { $in: string[] };
  keyword?: string;
}
