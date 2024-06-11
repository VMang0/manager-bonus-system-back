import Router from 'express'
import CategoryController from "../../controllers/CategoryController.js";

const categoryRouter = new Router();

categoryRouter.post('', CategoryController.add)
categoryRouter.get('', CategoryController.getAll)

export default categoryRouter;