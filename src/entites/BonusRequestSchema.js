import { model, Schema } from 'mongoose';

const BonusRequestSchema = new Schema({
  bonus: {  type: Schema.Types.ObjectId, ref: 'Bonus' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['allow', 'reject', 'expired', 'in waiting'], default: 'in waiting' },
  startDate: {  type: String },
  finishDate: {  type: String },
  processedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  processingDate: { type: Date },
  notes: { type: String },
  code: { type: String },
}, { timestamps: true });

export default model('BonusRequest', BonusRequestSchema)