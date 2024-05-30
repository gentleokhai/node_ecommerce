import mongoose, { Schema, Document } from 'mongoose';
import { Gender } from '../dto/general';

interface CustomerDoc extends Document {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  group: string;
}

const CustomerSchema = new Schema(
  {
    email: { type: String, unique: true, index: true },
    phoneNumber: { type: String },
    firstName: { type: String, index: true },
    lastName: { type: String, index: true },
    gender: { type: String, enum: Object.values(Gender), index: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'group' },
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id.toString();
        delete ret.__v;
        delete ret._id;
        delete ret.createdAt, delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Customer = mongoose.model<CustomerDoc>('customer', CustomerSchema);

export { Customer };
