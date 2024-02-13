import mongoose, { Schema, Document } from 'mongoose';

interface TokenDoc extends Document {
  id: Schema.Types.ObjectId;
  tokeN: string;
  createdAt: Date;
}

const TokenSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
});

const Token = mongoose.model<TokenDoc>('token', TokenSchema);

export { Token };
