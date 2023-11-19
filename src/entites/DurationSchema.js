import { model, Schema } from 'mongoose';

const DurationSchema = new Schema({
  name: { type: String, enum: ['1 год', '1 месяц', '1 неделя', '1 день'], default: '1 день' },
});

export default model('Duration', DurationSchema)