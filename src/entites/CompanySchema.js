import { model, Schema } from 'mongoose';

const CompanySchema = new Schema({
  name: { type: String, require: true, unique: true },
});

export default model('Company', CompanySchema)