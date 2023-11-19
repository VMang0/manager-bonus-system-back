import { model, Schema } from 'mongoose';

const PrioritySchema = new Schema({
  name: { type: String, required: true, unique: true },
});

const defaultPriorities = [
  { name: 'high' },
  { name: 'critical ' },
  { name: 'strategic ' },
];

const PriorityModel = model('Priority', PrioritySchema);

PriorityModel.find().then((priorities) => {
  if (priorities.length === 0) {
    PriorityModel.create(defaultPriorities);
  }
});

export default model('Priority', PrioritySchema)
