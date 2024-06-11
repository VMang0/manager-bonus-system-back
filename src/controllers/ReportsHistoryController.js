import reportsHistoryService from "../services/ReportsHistoryService.js";

class ReportsHistoryController {
  async getAllTasksReports(req, res, next) {
    try {
      const { taskId } = req.params;
      const project = await reportsHistoryService.getAllTasksReports(taskId);
      return res.json(project);
    } catch (e) {
      next(e);
    }
  }
}

export default new ReportsHistoryController();