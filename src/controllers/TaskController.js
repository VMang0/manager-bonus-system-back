import taskService from "../services/TaskService.js";

class TaskController {

  async addTask(req, res, next){
    try {
      const { user } = req;
      const { projectId, ...task } = req.body;
      const newTask = await taskService.addTask(user.id, projectId, task);
      return res.json(newTask);
    } catch (e) {
      next(e)
    }
  }

  async getProjectTasks(req, res, next){
    try {
      const { user } = req;
      const { projectId } = req.params;
      const task = await taskService.getProjectTasks(user, projectId);
      return res.json(task);
    } catch (e) {
      next(e)
    }
  }

  async addTaskTracking(req, res, next){
    try {
      const { user } = req;
      const { taskId } = req.params;
      const files = req.files;
      let file = null;
      if (files && files['file']) file = files['file'];
      const info = JSON.parse(req.body['info']);
      const task = await taskService.addTaskTracking(user, taskId, info, file);
      return res.json(task);
    } catch (e) {
      next(e)
    }
  }

  async reviewedTask(req, res, next){
    try {
      const { user } = req;
      const { taskId } = req.params;
      const task = await taskService.reviewedTask(user, taskId, req.body);
      return res.json(task);
    } catch (e) {
      next(e)
    }
  }
}
export default new TaskController();