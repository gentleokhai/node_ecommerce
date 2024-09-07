import { IsPhoneNumber } from 'class-validator';
import mongoose, { Schema, Document } from 'mongoose';

interface Item {
  item: string;
  numberOfItems: number;
  status: 'COMPLETED' | 'REFUNDED';
}
interface TransactionsDoc extends Document {
  customer: string;
  numberOfItems: string;
  methodOfPayment: string;
  typeOfTransaction: string;
  cashier: string;
  amount: number;
  createdAt: string;
  items: Item[];
  company: string;
}

const ItemSchema: Schema = new Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'item' },
    numberOfItems: { type: Number, required: true },
    status: {
      type: String,
      enum: ['COMPLETED', 'REFUNDED'],
      default: 'COMPLETED',
    },
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

const TransactionsSchema = new Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customer',
      default: null,
    },
    items: { type: [ItemSchema], required: true },
    methodOfPayment: { type: String },
    typeOfTransaction: { type: String },
    cashier: { type: mongoose.Schema.Types.ObjectId, ref: 'employee' },
    amount: { type: Number },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'company' },
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id.toString();
        delete ret.__v;
        delete ret._id;
        delete ret.updatedAt;
      },
    },
    toObject: {
      transform(_, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const Transactions = mongoose.model<TransactionsDoc>(
  'transactions',
  TransactionsSchema
);

export { Transactions };
