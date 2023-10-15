import Router from 'express'
import UserController from "../controllers/UserController.js";

const userRouter = new Router()

userRouter.post('/users', UserController.create)
userRouter.get('/users', UserController.getAll)
userRouter.get('/users/:id', UserController.getOne)
userRouter.put('/users', UserController.update)
userRouter.delete('/users/:id', UserController.delete)

export default userRouter;