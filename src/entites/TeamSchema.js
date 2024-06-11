import { model, Schema } from 'mongoose';

const TeamSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export default model('Team', TeamSchema)