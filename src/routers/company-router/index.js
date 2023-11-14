import Router from 'express'
import {body} from "express-validator";
import CompanyController from "../../controllers/CompanyController.js";

const userRouter = new Router();

userRouter.post('/add',
  body('name').isLength({min: 1, max: 100}),
  CompanyController.add)
userRouter.get('/all', CompanyController.getAll)

export default userRouter;