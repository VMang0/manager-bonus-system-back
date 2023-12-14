import { model, Schema } from 'mongoose';

const TaskSchema = new Schema({
  name: { type: String },
  description: { type: String },
  dateStart: { type: Date, default: new Date() },
  dateFinish: { type: Date },
  deadline: { type: Date, default: new Date() },
  priority: { type: Schema.Types.ObjectId, ref: 'Priority' },
  complexity: { type: Schema.Types.ObjectId, ref: 'TaskComplexity'},
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  executor: { type: Schema.Types.ObjectId, ref: 'User' },
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
  status: { type: String, enum: ['completed', 'in progress', 'off track', 'checked', 'expired'], default: 'in progress' },
  attempt: { type: Number, default: 1 },
  ball: { type: Number, default: 0 },
},
  { timestamps: true }
);

export default model('Task', TaskSchema);