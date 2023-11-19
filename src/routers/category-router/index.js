import Router from 'express'
import {body} from "express-validator";
import UserController from "../../controllers/UserController.js";
import CategoryController from "../../controllers/CategoryController.js";

const categoryRouter = new Router();

categoryRouter.post('/add', CategoryController.add)
categoryRouter.get('/all', CategoryController.getAll)

export default categoryRouter;