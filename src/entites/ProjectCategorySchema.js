import { model, Schema } from 'mongoose';

const ProjectCategorySchema = new Schema({
  name: { type: String, require: true, unique: true },
});

export default model('ProjectCategory', ProjectCategorySchema)