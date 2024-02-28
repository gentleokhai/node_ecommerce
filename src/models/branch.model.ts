import mongoose, { Schema, Document } from 'mongoose';

interface BranchDoc extends Document {
  branchName: string;
}

const BranchSchema = new Schema(
  {
    branchName: { type: String },
    branchId: {
      type: Schema.Types.ObjectId,
      default: new mongoose.Types.ObjectId,
    },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'company' },
  },
  {
    toJSON: {
      transform(_, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt, delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Branch = mongoose.model<BranchDoc>('branch', BranchSchema);

export { Branch };
