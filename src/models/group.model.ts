import mongoose, { Schema, Document } from 'mongoose';

interface GroupDoc extends Document {
  name: string;
}

const GroupSchema = new Schema(
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

const Group = mongoose.model<GroupDoc>('group', GroupSchema);

export { Group };
