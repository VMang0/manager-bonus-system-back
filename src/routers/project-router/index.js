import Router from 'express'
import ProjectController from "../../controllers/ProjectController.js";

const ProjectRouter = new Router();

ProjectRouter.post('', ProjectController.add)
ProjectRouter.get('', ProjectController.getProjects)
ProjectRouter.put('', ProjectController.updateProject)
ProjectRouter.put('/archive/:projectId', ProjectController.archiveProject)
ProjectRouter.get('/team/:projectId', ProjectController.getProjectTeam)
ProjectRouter.get('/pm/:projectId', ProjectController.getProjectPM)

export default ProjectRouter;