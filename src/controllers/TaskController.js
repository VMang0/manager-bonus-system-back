import taskService from "../services/TaskService.js";
import {dateConvert, dateEndConvert} from "../config/date-convert/index.js";

class TaskController {

  async add(req, res, next){
    try {
      const task = req.body;
      const newTask = await taskService.add({...task,
        dateStart: dateConvert(task.dateStart),
        deadline: dateConvert(task.deadline)
      });
      return res.json(newTask);
    } catch (e) {
      next(e)
    }
  }

  async getAll(req, res, next){
    try {
      const task = await taskService.getAll();
      return res.json(task);
    } catch (e) {
      next(e)
    }
  }

  async getUsersTasks(req, res, next){
    try {
      const userId = req.params.id;
      const projectId = req.params.projectId;
      const task = await taskService.getUsersTasks(userId, projectId);
      return res.json(task);
    } catch (e) {
      next(e)
    }
  }

  async sendTask(req, res, next){
    try {
      const id = req.params.id;
      const file = req.files['file'];
      const task = await taskService.sendTask(id, file);
      return res.json(task);
    } catch (e) {
      next(e)
    }
  }

  async allowTask(req, res, next){
    try {
      const { id, ball } = req.body;
      const task = await taskService.allowTask(id, ball);
      return res.json(task);
    } catch (e) {
      next(e)
    }
  }

  async rejectTask(req, res, next){
    try {
      const { id, dateStartNew, dateFinishNew } = req.body;
      const task = await taskService.rejectTask(id, dateConvert(dateStartNew), dateEndConvert(dateFinishNew));
      return res.json(task);
    } catch (e) {
      next(e)
    }
  }

}
export default new TaskController();