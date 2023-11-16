import priorityService from "../services/PriorityService.js";

class PriorityController {
  async getAll(req, res, next) {
    try {
      const priority = await priorityService.getAll();
      return res.json(priority);
    } catch (e) {
      next(e);
    }
  }
}
export default new PriorityController();