import ReportHistorySchema from "../entites/ReportsHistorySchema.js";
import taskService from './TaskService.js';

class ReportsHistoryService {
  async getAllTasksReports(taskId){
    const task = await taskService.getTask(taskId);
    const filesHistory = await ReportHistorySchema.find({ task });
    return filesHistory;
  }
}

export default new ReportsHistoryService();