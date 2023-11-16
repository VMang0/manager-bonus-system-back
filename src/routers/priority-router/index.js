import Router from 'express'
import PriorityController from "../../controllers/PriorityController.js";

const PriorityRouter = new Router();

PriorityRouter.get('/all', PriorityController.getAll)

export default PriorityRouter;