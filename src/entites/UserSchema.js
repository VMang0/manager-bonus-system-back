import { model, Schema } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, require: true, unique: true },
  password: { type: String },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  role: { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee' },
  company: { type: Schema.Types.ObjectId, ref: 'Company' },
  info: { type: Schema.Types.ObjectId, ref: 'UserInfo' },
  image: { type: String },
  scope: { type: Number },
},
  { timestamps: true }
);

export default model('User', UserSchema)