import { model, Schema } from 'mongoose';

const TaskSchema = new Schema({
  name: { type: String },
  description: { type: String },
  priority: { type: String },
  complexity: { type: String },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  executor: { type: Schema.Types.ObjectId, ref: 'User' },
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
  status: { type: String, enum: ['completed', 'in progress', 'rejected', 'checked'], default: 'in progress' },
  attempt: { type: Number, default: 1 },
  ball: { type: Number, default: 0 },
  estimation: { type: Number, default: 5 },
  spendEstimation: { type: Number, default: 0 },

  xpGained: { type: Number, default: 0 },
},
  { timestamps: true }
);

export default model('Task', TaskSchema);