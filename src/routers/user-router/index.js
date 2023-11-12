import Router from 'express'
import {body} from "express-validator";
import UserController from "../../controllers/UserController.js";

const userRouter = new Router();

userRouter.post('/registration',
  body('email').isEmail(),
  body('password').isLength({min: 3, max: 32}),
  UserController.registration)
userRouter.post('/login', UserController.login)
userRouter.post('/logout', UserController.logout)
userRouter.get('/activate/:link', UserController.activate)
userRouter.get('/refresh', UserController.refresh)
userRouter.get('/users/activate/:company', UserController.getUsersForActivate)
userRouter.post('/user/verify', UserController.verifyUser)

export default userRouter;