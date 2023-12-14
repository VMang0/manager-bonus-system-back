import {model, Schema} from "mongoose";

const ReportHistorySchema = new Schema({
    task: { type: Schema.Types.ObjectId, ref: 'Task' },
    url: { type: String },
    name: { type: String }
  },
  { timestamps: true }
);

export default model('ReportHistory', ReportHistorySchema);