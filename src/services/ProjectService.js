import ProjectSchema from "../entites/ProjectSchema.js";
import TeamSchema from "../entites/TeamSchema.js";
import ApiErrors from "../exceptions/api-errors.js";

class ProjectService {
  async add(team, projectInfo) {
    const find = await ProjectSchema.findOne({ name: projectInfo.name });
    if (find) {
      throw ApiErrors.BadRequest(`Проект ${projectInfo.name} уже существует в системе!`)
    }
    const project = await ProjectSchema.create(projectInfo);
    if (team.length > 0) {
      team.map( async (employee) => {
        await TeamSchema.create({ user: employee, project: project._id })
      });
    }
    return ProjectSchema.findById(project._id)
      .populate('category')
      .populate('priority')
      .populate('pm');
  }

  async getAll() {
    const projects = await ProjectSchema.find()
      .populate('category')
      .populate('priority')
      .populate('pm');
    return projects;
  }
}
export default new ProjectService();

/*
.populate({
  path: 'pm',
  model: 'User',
  populate: {
    path: 'info',
    model: 'UserInfo'
  }
});*/
