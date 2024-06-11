import projectService from "../services/ProjectService.js";

class ProjectController {

  async add(req, res, next) {
    try {
      const { user } = req;
      const newProject = await projectService.add(req.body, user)
      return res.json(newProject);
    } catch (e) {
      next(e);
    }
  }

  async getProjects(req, res, next) {
    try {
      const { user } = req;
      const project = await projectService.getProjects(user.id);
      return res.json(project);
    } catch (e) {
      next(e);
    }
  }

  async archiveProject(req, res, next) {
    try {
      const { projectId } = req.params;
      await projectService.archiveProject(projectId);
      return res.json('');
    } catch (e) {
      next(e);
    }
  }

  async updateProject(req, res, next) {
    try {
      const updatedProject = await projectService.updateProject(req.body);
      return res.json(updatedProject);
    } catch (e) {
      next(e);
    }
  }

  async getProjectTeam(req, res, next) {
    try {
      const { projectId } = req.params;
      const team = await projectService.getProjectTeam(projectId);
      return res.json(team);
    } catch (e) {
      next(e);
    }
  }

  async getProjectPM(req, res, next) {
    try {
      const { projectId } = req.params;
      const team = await projectService.getProjectPM(projectId);
      return res.json(team);
    } catch (e) {
      next(e);
    }
  }
}
export default new ProjectController();