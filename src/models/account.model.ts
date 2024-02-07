import mongoose, { Schema, Document } from 'mongoose';

interface AccountDoc extends Document {
  email: string;
  password: string;
  phoneNumber: string;
  currency: string;
  salt: string;
}

const AccountSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    currency: { type: String, required: true },
    salt: { type: String, required: true },
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id.toString();
        delete ret.password;
        delete ret._id;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt, delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Account = mongoose.model<AccountDoc>('account', AccountSchema);

export { Account };
