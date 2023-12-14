import { model, Schema } from 'mongoose';

const BonusSchema = new Schema({
  name: { type: String, require: true },
  duration: { type: String, enum: ['1 год', '1 месяц', '1 неделя', '1 день', 'бесрочно'], default: '1 день' },
  cost: { type: Number, require: true },
  partner: { type: String },
  price: { type: Number },
  company: { type: Schema.Types.ObjectId, ref: 'Company' },
  status: { type: Boolean, default: true },
  isView: { type: Boolean, default: true },
}, { timestamps: true });

export default model('Bonus', BonusSchema)