import { model, Schema } from 'mongoose';

const UserInfoSchema = new Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  birthday: { type: Date, required: true },
  workday: { type: Date, required: true },
  position: { type: String, required: true },
  rang: { type: String, required: true },
  salary: { type: Number, required: true },
  scope: { type: Number },
});

export default model('UserInfo', UserInfoSchema);