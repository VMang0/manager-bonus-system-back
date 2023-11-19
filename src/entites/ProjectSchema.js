import { model, Schema } from 'mongoose';

const ProjectSchema = new Schema({
  name: { type: String, require: true },
  category: { type: Schema.Types.ObjectId, ref: 'ProjectCategory' },
  status: { type: String, enum: ['completed', 'in progress', 'off track'], default: 'in progress' },
  priority: { type: Schema.Types.ObjectId, ref: 'Priority' },
  dateStart: { type: Date, default: new Date() },
  dateFinish: { type: Date, default: new Date() },
  dateCreate: { type: Date, default: new Date() },
  pm: { type: Schema.Types.ObjectId, ref: 'User' },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  customer: { type: String, require: true }
});

export default model('Project', ProjectSchema)