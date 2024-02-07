import mongoose, { Schema, Document } from 'mongoose';

interface CompanyDoc extends Document {
  businessType: string;
  businessName: string;
  industry: string;
  employeeRange: string;
  streetNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

const CompanySchema = new Schema(
  {
    businessType: { type: String },
    businessName: { type: String },
    industry: { type: String },
    gender: { type: String },
    employeeRange: { type: String },
    streetNumber: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
  },
  {
    toJSON: {
      transform(_, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt, delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Company = mongoose.model<CompanyDoc>('company', CompanySchema);

export { Company };
