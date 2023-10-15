import mongoose from "mongoose";

const User = new mongoose.Schema({
  email: { type:String, require: true, unique: true },
  password: { type: String, require: true },
  picture: { type: String },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
  status: { type: Boolean, require: true },
  role: {
    type: String,
    enum: ['Manager', 'Admin', 'Employee'],
  },
});

export default mongoose.model('User', User)