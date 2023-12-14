import TaskSchema from "../entites/TaskSchema.js";
import CompanySettingsSchema from "../entites/CompanySettingsSchema.js";
import ApiErrors from "../exceptions/api-errors.js";
import UserService from "./UserService.js";
import UserSchema from "../entites/UserSchema.js";
import {dateConvert} from "../config/date-convert/index.js";
import ReportsHistoryService from "./ReportsHistoryService.js";
import CloudinaryService from "./CloudinaryService.js";

class TaskService {

  async add(task) {
    const { priority, complexity, dateStart, deadline } = task;
    const company = await UserService.getCompanyForUser(task.creator);
    const hours = this.culcHours(dateStart, deadline);
    const ball = await this.calcBall(company, priority.name, hours, complexity.name)
    const set = await TaskSchema.create({ ball, ...task });
    const newTask = await TaskSchema.findById(set._id)
      .populate({
        path: 'creator',
        model: 'User',
        populate: {
          path: 'info',
          model: 'UserInfo'
        }})
      .populate({
        path: 'executor',
        model: 'User',
        populate: {
          path: 'info',
          model: 'UserInfo'
        }})
      .populate('complexity')
      .populate('priority')
    return newTask;
  }

  culcHours(dateStart, deadline) {
    const start = new Date(dateStart);
    const end = new Date(deadline);
    const timeDifference = end - start;
    if (timeDifference < 1) {
      return 24;
    }
    return timeDifference / (1000 * 60 * 60);
  }

  async calcBall(company, priority, hours, complexity, attempt = 1, isCompletedSuccess = false, deadline) {
    const settings = await CompanySettingsSchema.findOne({ company });
    if (!settings) {
      throw ApiErrors.BadRequest('Настройки не найдены для указанной компании.');
    }
    const priorityCoefficients = settings.settings.priority;
    const complexityCoefficients = settings.settings.complexity;
    const successCoefficients = settings.settings.success;

    const priorityCoefficient = priorityCoefficients[priority] || 0;
    const complexityCoefficient = complexityCoefficients[complexity] || 0;
    const successCoefficient = attempt === 1
      ? successCoefficients.first
      : (attempt === 2 ? successCoefficients.second : successCoefficients.more);
    if (isCompletedSuccess && attempt === 1){
      const today = dateConvert(new Date());
      const earlyHours = this.culcHours(today, deadline);
      if (earlyHours > 24) {
        hours += earlyHours;
      }
    }
    const totalScore = hours / 10 * priorityCoefficient * complexityCoefficient * successCoefficient;
    return Math.round(totalScore);
  }

  async getAll() {
    const tasks = await TaskSchema.find()
      .populate({
        path: 'creator',
        model: 'User',
        populate: {
          path: 'info',
          model: 'UserInfo'
        }})
      .populate({
        path: 'executor',
        model: 'User',
        populate: {
          path: 'info',
          model: 'UserInfo'
        }})
      .populate('complexity')
      .populate('priority')
    return tasks;
  }

  async getUsersTasks(userId, projectId) {
    const tasks = await TaskSchema.find({
      $or: [
        { creator: userId, project: projectId },
        { executor: userId, project: projectId },
      ], })
      .populate({
        path: 'creator',
        model: 'User',
        populate: {
          path: 'info',
          model: 'UserInfo'
        }})
      .populate({
        path: 'executor',
        model: 'User',
        populate: {
          path: 'info',
          model: 'UserInfo'
        }})
      .populate('complexity')
      .populate('priority')
    return tasks;
  }

  async sendTask(id, file) {
    const { url, fileName } = await CloudinaryService.sendFile(file);
    if (!url) {
      throw ApiErrors.BadRequest('Произошли проблемы с загрузкой отчета.Повторите попытку позже!');
    }
    const oldTask = await TaskSchema.findById(id).populate('complexity').populate('priority');
    const newFile = await ReportsHistoryService.addFileToHistory(id, url, fileName);
    const ball = await this.getBall(oldTask, true);
    await TaskSchema.findByIdAndUpdate(id, { status: 'checked', dateFinish: dateConvert(new Date()), ball});
    const task = await TaskSchema.findById(id)
      .populate({
        path: 'creator',
        model: 'User',
        populate: {
          path: 'info',
          model: 'UserInfo'
        }})
      .populate({
        path: 'executor',
        model: 'User',
        populate: {
          path: 'info',
          model: 'UserInfo'
        }})
      .populate('complexity')
      .populate('priority')
    return { task, newFile };
  }

  async findById(id, param){
    const newTask = await TaskSchema.findByIdAndUpdate(id, param, { new: true })
      .populate({
        path: 'creator',
        model: 'User',
        populate: {
          path: 'info',
          model: 'UserInfo'
        }})
      .populate({
        path: 'executor',
        model: 'User',
        populate: {
          path: 'info',
          model: 'UserInfo'
        }})
      .populate('complexity')
      .populate('priority')
    return newTask;
  }

  async allowTask(id, ball) {
    const task = await TaskSchema.findById(id).populate('complexity').populate('priority');
    if (!task) {
      throw ApiErrors.BadRequest('Задача не найдена')
    }
    const newTask = await this.findById(id, { status: 'completed', ball });
    const user = await UserSchema.findById(task.executor);
    const newScope = (user.scope || 0) + ball;
    await UserSchema.findByIdAndUpdate(task.executor, { scope: newScope});
    return newTask;
  }

  async rejectTask(id, dateStartNew, dateFinishNew) {
    const task = await TaskSchema.findById(id).populate('complexity').populate('priority');
    if (!task) {
      throw ApiErrors.BadRequest('Задача не найдена')
    }
    const taskWithNewBall = JSON.parse(JSON.stringify(task));
    const newAttempt = taskWithNewBall.attempt + 1;
    const ball = await this.getBall({ ...taskWithNewBall, attempt: newAttempt }, false)
    const newTask = await this.findById(id,
      { status: 'off track', attempt: newAttempt, ball, dateStart: dateStartNew, deadline: dateFinishNew });
    return newTask;
  }

  async getBall(task, isCompletedSuccess) {
    const { priority, complexity, attempt, dateStart, deadline } = task;
    const company = await UserService.getCompanyForUser(task.creator);
    const hours = this.culcHours(dateStart, deadline);
    const ball = await this.calcBall(company, priority.name, hours, complexity.name, attempt, isCompletedSuccess, deadline)
    return ball;
  }

  async expiredTasks() {
    try {
      const tasks = await TaskSchema.find();
      tasks.map(async (task) => {
        const isExpired = new Date(dateConvert(new Date())) > new Date(task.deadline);
        if (task.status === 'in progress' && isExpired) {
          await TaskSchema.findByIdAndUpdate(task._id, {status: 'expired'})
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
}
export default new TaskService();