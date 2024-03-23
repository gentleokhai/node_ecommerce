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
  dateOfEmployment: string;
  status: string;
}

const EmployeeSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    phoneNumber: { type: String, required: true },
    salt: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, enum: Object.values(Gender), index: true },
    address: { type: String },
    accessType: { type: String, enum: Object.values(AccessType), index: true },
    jobTitle: { type: String, required: true, index: true },
    dateOfEmployment: { type: String, required: true },
    status: { type: String, enum: Object.values(Status), index: true },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
