export interface CreateCompanyInput {
  businessName: string;
  businessType: string;
  industry: string;
  companySize: string;
  addressNumber: string;
  buyingCurrency: string;
  sellingCurrency: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface UpdateViewingCurrencyInput {
  viewingCurrency: string;
}

export interface UpdateSellingCurrencyInput {
  sellingCurrency: string;
}
