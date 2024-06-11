import { model, Schema } from "mongoose";

const ReportHistorySchema = new Schema({
    hours: { type: Number },
    date: { type: String },
    url: { type: String },
    name: { type: String },
    task: { type: Schema.Types.ObjectId, ref: 'Task' },
  },
  { timestamps: true }
);

export default model('ReportHistory', ReportHistorySchema);