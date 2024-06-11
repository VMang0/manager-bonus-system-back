import Router from 'express'
import UserController from "../../controllers/UserController.js";

const userRouter = new Router();

userRouter.get('/user', UserController.getUser)
userRouter.post('/info', UserController.addUserInformation)
userRouter.get('/user/activate', UserController.getUsersForActivate)
userRouter.get('/user/all', UserController.getEmployeesWithoutPms)

userRouter.get('/managers', UserController.getManagers)
userRouter.post('/managers', UserController.addManager)

userRouter.get('/pm', UserController.getPMs)
userRouter.get('/user/employees', UserController.getEmployeesForCompany)
userRouter.put('/user/image', UserController.updateImage)

export default userRouter;