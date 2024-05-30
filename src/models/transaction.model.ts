import mongoose, { Schema, Document } from 'mongoose';

interface TransactionsDoc extends Document {
  customerId: string;
  numberOfItems: string;
  methodOfPayment: string;
  typeOfTransaction: string;
  cashierId: string;
  amount: string;
}

interface Item {
  itemId: string;
  numberOfItems: number;
}

const ItemSchema: Schema = new Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'item' },
    numberOfItems: { type: Number, required: true },
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
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'customer' },
    items: { type: [ItemSchema], required: true },
    methodOfPayment: { type: String },
    typeOfTransaction: { type: String },
    cashierId: { type: mongoose.Schema.Types.ObjectId, ref: 'employee' },
    amount: { type: String },
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
    timestamps: true,
  }
);

const Transactions = mongoose.model<TransactionsDoc>(
  'transactions',
  TransactionsSchema
);

export { Transactions };
