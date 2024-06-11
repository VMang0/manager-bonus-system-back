import { model, Schema } from 'mongoose';

const ProjectSchema = new Schema({
  name: { type: String, require: true },
  category: { type: String, require: true },
  customer: { type: String, require: true },
  status: { type: String, enum: ['completed', 'in progress'], default: 'in progress' },
  pm: { type: Schema.Types.ObjectId, ref: 'User' },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
  isArchive: { type: Boolean, default: false },
},
  { timestamps: true }
);
export default model('Project', ProjectSchema)