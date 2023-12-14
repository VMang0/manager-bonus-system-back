import TaskSchema from "../entites/TaskSchema.js";
import ApiErrors from "../exceptions/api-errors.js";
import ReportHistorySchema from "../entites/ReportsHistorySchema.js";

class ReportsHistoryService {
  async addFileToHistory(id, url, name){
    const task = await TaskSchema.findById(id);
    if (!task) {
      throw ApiErrors.BadRequest('Задача не была найдена!');
    }
    const fileHistory = await ReportHistorySchema.create({ task: id, url, name });
    return fileHistory;
  }
  async getAllFiles(id){
    const task = await TaskSchema.findById(id);
    if (!task) {
      throw ApiErrors.BadRequest('Задача не была найдена!');
    }
    const filesHistory = await ReportHistorySchema.find({ task: id });
    return filesHistory;
  }
}

export default new ReportsHistoryService();