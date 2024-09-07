import mongoose, { Schema, Document } from 'mongoose';

interface JobsDoc extends Document {
  name: string;
}

const JobsSchema = new Schema(
  {
    name: { type: String },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'company',
    },
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

const Jobs = mongoose.model<JobsDoc>('jobs', JobsSchema);

export { Jobs };
