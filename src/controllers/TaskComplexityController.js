import taskComplexityService from "../services/TaskComplexityService.js";

class TaskComplexityController {
  async getAll(req, res, next) {
    try {
      const complexities = await taskComplexityService.getAll();
      return res.json(complexities);
    } catch (e) {
      next(e);
    }
  }
}
export default new TaskComplexityController();