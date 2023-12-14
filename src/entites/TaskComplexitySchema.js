import { model, Schema } from 'mongoose';

const TaskComplexitySchema = new Schema({
  name: { type: String, required: true, unique: true },
});

const defaultPriorities = [
  { name: 'high' },
  { name: 'medium' },
  { name: 'low' },
];

const TaskComplexityModel = model('TaskComplexity', TaskComplexitySchema);

TaskComplexityModel.find().then((complexities) => {
  if (complexities.length === 0) {
    TaskComplexityModel.create(defaultPriorities);
  }
});

export default model('TaskComplexity', TaskComplexitySchema)
