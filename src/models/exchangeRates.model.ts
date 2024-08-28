import mongoose, { Schema, Document } from 'mongoose';

interface ExchangeRatesDoc extends Document {
  currencyCode: string;
  value: number;
  lastUpdated: Date;
}

const ExchangeRatesSchema = new Schema(
  {
    currencyCode: { type: String, required: true, unique: true },
    value: { type: Number, required: true },
    lastUpdated: { type: Date, required: true },
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

const ExchangeRates = mongoose.model<ExchangeRatesDoc>(
  'exchangeRates',
  ExchangeRatesSchema
);

export { ExchangeRates };
