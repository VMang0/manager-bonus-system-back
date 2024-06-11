import { model, Schema } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, require: true, unique: true },
  password: { type: String },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  role: { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee' },
  company: { type: Schema.Types.ObjectId, ref: 'Company' },
  image: { type: String },
  scope: { type: Number },

  name: { type: String },
  patronymic: { type: String },
  lastname: { type: String },
  position: { type: String },
  level: { type: String },

  rank: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  previousXp: { type: Number, default: 0 },
},
  { timestamps: true }
);

export default model('User', UserSchema)