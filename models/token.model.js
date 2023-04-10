import { Schema, model } from 'mongoose';

const TokenSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  refreshToken: { type: String, required: true }
});

export const TokenModel = model('Token', TokenSchema);
