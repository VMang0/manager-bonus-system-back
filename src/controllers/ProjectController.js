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
  async getAllUsersProject(req, res, next) {
    try {
      const id = req.params.id;
      const project = await projectService.getAllUsersProject(id);
      return res.json(project);
    } catch (e) {
      next(e);
    }
  }
  async getProjectTeam(req, res, next) {
    try {
      const team = await projectService.getProjectTeam();
      return res.json(team);
    } catch (e) {
      next(e);
    }
  }
  async update(req, res, next) {
    try {
      const {teamIds, ...project} = req.body;
      const newProject = await projectService.update(teamIds, project);
      return res.json(newProject);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const idProject = req.params.id;
      await projectService.delete(idProject);
      return res.json('Удаление прошло успешно');
    } catch (e) {
      next(e);
    }
  }
}
export default new ProjectController();