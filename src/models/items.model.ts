import mongoose, { Schema, Document } from 'mongoose';

interface ItemDoc extends Document {
  image: string;
  name: string;
  category: string;
  unit: string;
  sku: string;
  weight: string;
  currency: string;
  description: string;
  costPrice: string;
  sellingPrice: string;
  wholesalePrice: string;
  quantityInPack: string;
  stock: string;
  lowStock: string;
}

const ItemSchema = new Schema(
  {
    image: { type: String, default: null },
    name: { type: String, required: true },
    category: { type: String, required: true },
    unit: { type: String, required: true },
    sku: { type: String, required: true },
    weight: { type: String },
    description: { type: String },
    costPrice: { type: String, required: true },
    sellingPrice: { type: String, required: true },
    currency: { type: String, required: true },
    wholesalePrice: { type: String, default: null },
    quantityInPack: { type: String, default: null },
    stock: { type: String, default: null },
    lowStock: { type: String, default: null },
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id.toString();
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret._id;
        delete ret.createdAt, delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Item = mongoose.model<ItemDoc>('item', ItemSchema);

export { Item };
