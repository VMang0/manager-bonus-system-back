import projectService from "../services/ProjectService.js";

class ProjectController {
  async add(req, res, next) {
    try {
      const {team, ...project} = req.body;
      const newProject = await projectService.add(team, project);
      return res.json(newProject);
    } catch (e) {
      next(e);
    }
  }
  async getAll(req, res, next) {
    try {
      const project = await projectService.getAll();
      return res.json(project);
    } catch (e) {
      next(e);
    }
  }
}
export default new ProjectController();