import TaskSchema from "../entites/TaskSchema.js";
import ApiErrors from "../exceptions/api-errors.js";
import UserSchema from "../entites/UserSchema.js";
import CloudinaryService from "./CloudinaryService.js";
import CompanySettingsService from './CompanySettingsService.js';
import userService from './UserService.js';
import projectService from './ProjectService.js';
import ReportHistorySchema from '../entites/ReportsHistorySchema.js';

class TaskService {

  async getTask(taskId) {
    const task =  await TaskSchema.findById(taskId);
    if (!task) {
      throw ApiErrors.NotFound('Задача не найдена!')
    }
    return task;
  }

  async addTask(userId, projectId, task) {
    const user = await userService.getUser(userId);
    const project = await projectService.getProject(projectId);
    const newTask = await TaskSchema.create({...task, project, creator: userId });
    const ball = await this.calcBall(user.company._id, newTask);
    const fullNewTask = await TaskSchema.findByIdAndUpdate(newTask._id, { ball }, {new: true})
      .populate ({
      path: 'executor',
      model: 'User',
    })
      .populate({
        path: 'creator',
        model: 'User',
      });
    return fullNewTask;
  }

  async calcBall(companyId, task) {
    const settings = await CompanySettingsService.getSettings(companyId);
    const { priority, complexity, attempt, estimation, spendEstimation } = task;

    const priorityCoefficients = settings.priority;
    const complexityCoefficients = settings.complexity;
    const successCoefficients = settings.success;

    const priorityCoefficient = priorityCoefficients[priority] || 0;
    const complexityCoefficient = complexityCoefficients[complexity] || 0;
    const successCoefficient = attempt === 1
      ? successCoefficients.first
      : (attempt === 2 ? successCoefficients.second : successCoefficients.more);

    const requiredHours = estimation || 0;
    const spentHours = spendEstimation === 0 ? requiredHours : spendEstimation;

    const totalScore = (requiredHours / spentHours) * 10 * priorityCoefficient * complexityCoefficient * successCoefficient;

    return Math.round(totalScore);
  }

  async calcXp(companyId, task, ball) {
    const settings = await CompanySettingsService.getSettings(companyId);
    const { priority, complexity, attempt } = task;

    const priorityCoefficients = settings.priority;
    const complexityCoefficients = settings.complexity;
    const successCoefficients = settings.success;

    const priorityCoefficient = priorityCoefficients[priority] || 0;
    const complexityCoefficient = complexityCoefficients[complexity] || 0;
    let successCoefficient;

    if (attempt === 1) {
      successCoefficient = successCoefficients.first;
    } else if (attempt === 2) {
      successCoefficient = successCoefficients.second;
    } else {
      successCoefficient = successCoefficients.more;
    }

    const xp = Math.round((ball * priorityCoefficient * complexityCoefficient * successCoefficient) / 10);
    return xp;
  }

  async updateLevel(rank, xp) {
    const xpThresholds = [0, 800, 1800, 3000, 5000, 7500, 10500, 14000, 18000, 22500, 27500]
    while (rank < xpThresholds.length && xp >= xpThresholds[rank]) {
      rank++;
    }
    while (rank > 1 && xp < xpThresholds[rank - 1]) {
      rank--;
    }
    return rank;
  }

  async getProjectTasks(user, projectId) {
    await projectService.getProject(projectId);
    let condition = {};
    if (user.role === 'manager') {
      condition = { project: projectId, creator: user.id }
    } else if (user.role === 'employee' && user.position === 'Project Manager') {
      condition = {
        project: projectId,
        $or: [
          { executor: user.id },
          { creator: user.id }
        ]
      };
    } else {
      condition = { project: projectId, executor: user.id  }
    }
    const tasks = await TaskSchema.find(condition)
      .populate ({
        path: 'executor',
        model: 'User',
      })
      .populate({
        path: 'creator',
        model: 'User',
      });
    return tasks;
  }

  async addTaskTracking(user, taskId, { status, ...info }, file) {
    const task = await this.getTask(taskId);
    let fileUrl = null;
    let filename = null;
    if (file) {
      const { url, fileName } = await this.uploadReport(file);
      fileUrl = url;
      filename = fileName;
    }
    await ReportHistorySchema.create({ ...info, task: taskId, url: fileUrl, name: filename });
    let ball = task.ball;
    let xpGained = task.xpGained;
    if (status === 'checked') {
      ball = await this.calcBall(user.company,
        { ...task.toObject(), spendEstimation: task.spendEstimation + info.hours });
      xpGained = await this.calcXp(user.company, { ...task.toObject() }, ball);
    }

    const updatedTask = await TaskSchema.findByIdAndUpdate(taskId,
      { status, ball, spendEstimation: task.spendEstimation + info.hours, xpGained }, {new: true})
      .populate ({
        path: 'executor',
        model: 'User',
      })
      .populate({
        path: 'creator',
        model: 'User',
      });
    return updatedTask
  }

  async uploadReport(file) {
    const fileData = await CloudinaryService.sendFile(file);
    if (!fileData.url) {
      throw ApiErrors.BadRequest('Произошли проблемы с загрузкой отчета. Повторите попытку позже!');
    }
    return fileData;
  }

  async reviewedTask(user, taskId, info) {
    const task = await this.getTask(taskId);
    let xp = 0;

    if (info.status === 'rejected') {
      const ball = await this.calcBall(user.company, { ...task.toObject(), attempt: task.attempt + 1 });
      xp = await this.calcXp(user.company, { ...task.toObject(), attempt: task.attempt + 1 }, ball);
      xp = -xp;
      info = {...info, ball, xpGained: xp, attempt: task.attempt + 1 };
    }
    if (info.status === 'completed') {
      const executor = await userService.getUser(task.executor);
      const previousXp = executor.xp;
      const updateXp = previousXp + task.xpGained;
      const rank = await this.updateLevel(executor.rank, updateXp);
      await UserSchema.findByIdAndUpdate(task.executor, { scope: executor.scope + info.ball, rank, previousXp, xp: updateXp });
    }
    const updatedTask = await TaskSchema.findByIdAndUpdate(taskId, info, { new: true })
      .populate ({
        path: 'executor',
        model: 'User',
      })
      .populate({
        path: 'creator',
        model: 'User',
      });
    return updatedTask
  }

}
export default new TaskService();