import Router from 'express'
import TaskController from "../../controllers/TaskController.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const TaskRouter = new Router();

TaskRouter.post('', TaskController.addTask)
TaskRouter.get('/:projectId', TaskController.getProjectTasks)
TaskRouter.post('/:taskId', TaskController.addTaskTracking)
TaskRouter.put('/:taskId', TaskController.reviewedTask)

export default TaskRouter;