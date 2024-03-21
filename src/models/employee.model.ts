import mongoose, { Schema, Document } from 'mongoose';
import { Gender, Status } from '../dto/general';

interface EmployeeDoc extends Document {
  email: string;
  phoneNumber: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  gender: string;
  role: string;
  jobTitle: string;
  address: string;
  dateOfEmployment: Date;
  status: string;
}

const EmployeeSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, enum: Object.values(Gender), index: true },
    address: { type: String },
    role: { type: String },
    jobTitle: { type: String, required: true, index: true },
    dateOfEmployment: { type: Date, required: true },
    status: { type: String, enum: Object.values(Status), index: true },
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

const Employee = mongoose.model<EmployeeDoc>('employee', EmployeeSchema);

export { Employee };
