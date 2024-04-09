import mongoose, { Schema, Document } from 'mongoose';

interface CategoryDoc extends Document {
  name: string;
}

const CategorySchema = new Schema(
  {
    name: { type: String },
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

const Category = mongoose.model<CategoryDoc>('category', CategorySchema);

export { Category };
