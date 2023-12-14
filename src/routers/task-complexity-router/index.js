import Router from 'express'
import TaskComplexityController from "../../controllers/TaskComplexityController.js";

const TaskComplexityRouter = new Router();

TaskComplexityRouter.get('/all', TaskComplexityController.getAll)

export default TaskComplexityRouter;