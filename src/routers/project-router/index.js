import Router from 'express'
import ProjectController from "../../controllers/ProjectController.js";

const ProjectRouter = new Router();

ProjectRouter.post('/add', ProjectController.add)
ProjectRouter.get('/all', ProjectController.getAll)

export default ProjectRouter;