import mongoose, { Schema, Document } from 'mongoose';
import { Gender } from '../dto/general';

export interface EmployerDoc extends Document {
  email: string;
  phoneNumber: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  gender: string;
  role: string;
  address: string;
  company: string;
}

const EmployerSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String, enum: Object.values(Gender), index: true },
    address: { type: String },
    role: { type: String },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'company' },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'branch' },
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

const Employer = mongoose.model<EmployerDoc>('employer', EmployerSchema);

export { Employer };
