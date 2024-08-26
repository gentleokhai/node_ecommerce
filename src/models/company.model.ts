import mongoose, { Schema, Document } from 'mongoose';

interface CompanyDoc extends Document {
  businessType: string;
  businessName: string;
  industry: string;
  companySize: string;
  buyingCurrency: string;
  sellingCurrency: string;
  viewingCurrency?: string;
  addressNumber: string;
  street: string;
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
    companySize: { type: String },
    addressNumber: { type: String },
    sellingCurrency: { type: String },
    buyingCurrency: { type: String },
    viewingCurrency: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    branch: [{ type: mongoose.Schema.Types.ObjectId, ref: 'branch' }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id.toString();
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

CompanySchema.pre('save', function (next) {
  if (!this.viewingCurrency && this.sellingCurrency) {
    this.viewingCurrency = this.sellingCurrency;
  }
  next();
});

const Company = mongoose.model<CompanyDoc>('company', CompanySchema);

export { Company };
