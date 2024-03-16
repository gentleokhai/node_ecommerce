import mongoose, { Schema, Document } from 'mongoose';

interface BranchDoc extends Document {
  name: string;
}

const BranchSchema = new Schema(
  {
    name: { type: String },
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id.toString();
        delete ret.__v;
        delete ret.createdAt, delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Branch = mongoose.model<BranchDoc>('branch', BranchSchema);

export { Branch };
