import mongoose, { Schema, Document } from 'mongoose';

interface ItemDoc extends Document {
  image: string;
  name: string;
  category: string;
  unit: string;
  sku: string;
  weight: number;
  currency: string;
  description: string;
  costPrice: number;
  sellingPrice: number;
  wholesalePrice: number;
  quantityInPack: number;
  stock: number;
  lowStock: number;
  archived: boolean;
}

const ItemSchema = new Schema(
  {
    image: { type: String, default: null },
    name: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category',
    },
    unit: { type: String },
    sku: { type: String },
    weight: { type: String },
    description: { type: String },
    costPrice: { type: Number },
    sellingPrice: { type: Number },
    currency: { type: String },
    wholesalePrice: { type: Number, default: null },
    quantityInPack: { type: Number, default: null },
    stock: { type: Number, default: null },
    lowStock: { type: Number, default: null },
    archived: { type: Boolean, default: false },
  },
  {
    toJSON: {
      transform(_, ret) {
        if (ret._id) {
          ret.id = ret._id.toString();
        }
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret._id;
        delete ret.createdAt, delete ret.updatedAt;
      },
    },
    toObject: {
      transform(_, ret) {
        if (ret._id) {
          ret.id = ret._id.toString();
        }
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
