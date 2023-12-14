import reportsHistoryService from "../services/ReportsHistoryService.js";

class ReportsHistoryController {
  async getAll(req, res, next) {
    try {
      const id = req.params.id;
      const project = await reportsHistoryService.getAllFiles(id);
      return res.json(project);
    } catch (e) {
      next(e);
    }
  }
}

export default new ReportsHistoryController();