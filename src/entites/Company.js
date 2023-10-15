import mongoose from "mongoose";

const Company = new mongoose.Schema({
  name: {type: String, require: true, unique: true}
});

export default mongoose.model('Company', Company)