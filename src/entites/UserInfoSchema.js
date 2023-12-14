import { model, Schema } from 'mongoose';

const UserInfoSchema = new Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  birthday: { type: Date, required: true },
  workday: { type: Date, required: true },
  position: { type: String, required: true },
  rang: { type: String },
  salary: { type: Number, required: true },
});

export default model('UserInfo', UserInfoSchema);