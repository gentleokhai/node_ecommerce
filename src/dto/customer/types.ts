export interface CreateCustomerInput {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
}

export interface FilterTypes {
  accessType?: { $in: string[] };
  status?: { $in: string[] };
  keyword?: string;
}
