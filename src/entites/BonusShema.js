import { model, Schema } from 'mongoose';

const BonusSchema = new Schema({
  name: { type: String, require: true },
  description: { type: String },
  category: { type: String },
  duration: { type: String, enum: ['1 год', '1 месяц', '1 неделя', '1 день', 'бесрочно'], default: '1 день' },
  rank: { type: Number, default: 1 },
  partner: { type: String },
  price: { type: Number, require: true  },
  company: { type: Schema.Types.ObjectId, ref: 'Company' },
  isView: { type: Boolean, default: true },
}, { timestamps: true });

export default model('Bonus', BonusSchema)