import { model, Schema } from 'mongoose';

const TeamSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
});

export default model('Team', TeamSchema)