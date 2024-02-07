import mongoose, { Schema, Document } from 'mongoose';

interface UserDoc extends Document {
  firstName: string;
  lastName: string;
  gender: string;
  role: string;
  address: string;
}

const UserSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String },
    address: { type: String },
    role: { type: String },
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

const User = mongoose.model<UserDoc>('user', UserSchema);

export { User };
