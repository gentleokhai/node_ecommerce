import mongoose, { Schema, Document } from 'mongoose';

interface UserDoc extends Document {
  userId: string;
  email: string;
  phoneNumber: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  gender: string;
  role: string;
  address: string;
}

const UserSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String },
    address: { type: String },
    role: { type: String },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'company' },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'branch' },
  },
  {
    toJSON: {
      transform(_, ret) {
        delete ret.__v;
        delete ret._id;
        delete ret.createdAt, delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const User = mongoose.model<UserDoc>('user', UserSchema);

export { User };
