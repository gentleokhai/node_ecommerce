import mongoose, { Schema, Document } from 'mongoose';

interface CompanyDoc extends Document {
  businessId: string;
  businessType: string;
  businessName: string;
  industry: string;
  companySize: string;
  buyingCurrency: string;
  sellingCurrency: string;
  addressNumber: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

const CompanySchema = new Schema(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
    businessType: { type: String },
    businessName: { type: String },
    industry: { type: String },
    gender: { type: String },
    companySize: { type: String },
    addressNumber: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  },
  {
    toJSON: {
      transform(_, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret._id;
        delete ret.createdAt, delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Company = mongoose.model<CompanyDoc>('company', CompanySchema);

export { Company };
