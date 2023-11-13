import { model, Schema } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, require: true, unique: true },
  password: { type: String },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  role: { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee' },
  company: { type: Schema.Types.ObjectId, ref: 'Company' },
  info: { type: Schema.Types.ObjectId, ref: 'UserInfo' },
  date: { type: Date, default: new Date() },
});

export default model('User', UserSchema)