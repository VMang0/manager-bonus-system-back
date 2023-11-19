import { model, Schema } from 'mongoose';

const BonusSchema = new Schema({
  name: { type: String, require: true },
  duration: { type: Schema.Types.ObjectId, ref: 'Duration' },
  cost: { type: Number, require: true },
  partner: { type: String, require: true },
  price: { type: Number, require: true },
  company: { type: Schema.Types.ObjectId, ref: 'Company' },
  status: { type: Boolean, default: true }
});

export default model('Bonus', BonusSchema)