import mongoose, { Schema, Document } from 'mongoose';
import { AccessType, Gender, Status } from '../dto/general';

interface EmployeeDoc extends Document {
  email: string;
  phoneNumber: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  gender: string;
  accessType: string;
  jobTitle: string;
  address: string;
  company: string;
  dateOfEmployment: string;
  status: string;
  verified: boolean;
  verificationToken?: string;
  tokenExpiration?: Date;
}

const EmployeeSchema = new Schema(
  {
    email: { type: String, unique: true, index: true },
    password: { type: String },
    phoneNumber: { type: String },
    salt: { type: String },
    firstName: { type: String, index: true },
    lastName: { type: String, index: true },
    gender: { type: String, enum: Object.values(Gender), index: true },
    address: { type: String },
    verificationToken: { type: String, default: undefined },
    tokenExpiration: { type: Date, default: undefined },
    verified: { type: Boolean, default: false },
    accessType: { type: String, enum: Object.values(AccessType), index: true },
    jobTitle: {
      type: mongoose.Schema.Types.ObjectId,

      ref: 'jobs',
      index: true,
    },
    dateOfEmployment: { type: String },
    status: { type: String, enum: Object.values(Status), index: true },
    company: {
      type: mongoose.Schema.Types.ObjectId,

      ref: 'company',
    },
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

const Employee = mongoose.model<EmployeeDoc>('employee', EmployeeSchema);

export { Employee };
