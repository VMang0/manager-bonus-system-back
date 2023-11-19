import Router from 'express'
import ProjectController from "../../controllers/ProjectController.js";

const ProjectRouter = new Router();

ProjectRouter.post('/add', ProjectController.add)
ProjectRouter.get('/all', ProjectController.getAll)
ProjectRouter.get('/user/:id', ProjectController.getAllUsersProject)
ProjectRouter.get('/team', ProjectController.getProjectTeam)
ProjectRouter.post('/update', ProjectController.update)
ProjectRouter.delete('/delete/:id', ProjectController.delete)

export default ProjectRouter;