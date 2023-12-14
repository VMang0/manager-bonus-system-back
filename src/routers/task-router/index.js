import Router from 'express'
import TaskController from "../../controllers/TaskController.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const TaskRouter = new Router();

TaskRouter.post('/add', TaskController.add)
TaskRouter.get('/', TaskController.getAll)
TaskRouter.get('/:id/:projectId', TaskController.getUsersTasks)
TaskRouter.post('/completion/:id', upload.single('file'), TaskController.sendTask)
TaskRouter.post('/allow', TaskController.allowTask)
TaskRouter.post('/reject', TaskController.rejectTask)

export default TaskRouter;