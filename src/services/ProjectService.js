import ProjectSchema from "../entites/ProjectSchema.js";
import TeamSchema from "../entites/TeamSchema.js";
import ApiErrors from "../exceptions/api-errors.js";
import userService from './UserService.js';

class ProjectService {

  async getProject(projectId) {
    const project =  await ProjectSchema.findById(projectId);
    if (!project) {
      throw ApiErrors.BadRequest('Проект не найден!')
    }
    return project;
  }

  async add({ team, ...info }, user) {
    let project = await ProjectSchema.create({ ...info, creator: user.id });
    project = await ProjectSchema.populate(project, [
      { path: 'pm', model: 'User' },
      { path: 'creator', model: 'User' }
    ]);

    if (team && team.length > 0) {
      const teamDocument = new TeamSchema({ users: team });
      const teamSaved = await teamDocument.save();
      project = await ProjectSchema.findByIdAndUpdate(project._id, { team: teamSaved.id }, { new: true })
        .populate({
          path: 'pm',
          model: 'User',
        })
        .populate({
          path: 'creator',
          model: 'User',
        })
        .populate({
          path: 'team',
          model: 'Team',
          populate: {
            path: 'users',
            model: 'User',
          },
        });
    } else {
      const teamDocument = new TeamSchema({ users: [] });
      const teamSaved = await teamDocument.save();
      project = await ProjectSchema.findByIdAndUpdate(project._id, { team: teamSaved.id }, { new: true })
        .populate({
          path: 'pm',
          model: 'User',
        })
        .populate({
          path: 'creator',
          model: 'User',
        })
        .populate({
          path: 'team',
          model: 'Team',
          populate: {
            path: 'users',
            model: 'User',
          },
        });
    }
    return project;
  }

  async getProjects(userId) {
    const user = await userService.getUser(userId);
    let condition = {};
    if (user.role === 'manager') {
      condition = { creator: user.id, isArchive: false }
    } else if (user.position === 'Project Manager') {
      condition = { pm: user.id, isArchive: false }
    } else {
      const teamsWithUser = await TeamSchema.find({ users: user.id }).select('_id');
      const teamIds = teamsWithUser.map(team => team._id);
      condition = { team: { $in: teamIds }, isArchive: false };
    }
    const projects = await ProjectSchema.find(condition)
      .populate({
        path: 'pm',
        model: 'User',
      })
      .populate({
        path: 'creator',
        model: 'User',
      })
      .populate({
        path: 'team',
        model: 'Team',
        populate: {
          path: 'users',
          model: 'User',
        },
      });
    return projects;
  }

  async archiveProject(projectId) {
    await this.getProject(projectId);
    await ProjectSchema.findByIdAndUpdate(projectId, { isArchive: true });
  }

  async updateProject({ team, id, ...info }) {
    const project = await ProjectSchema.findByIdAndUpdate(id, info);
    if (team) {
      await TeamSchema.findByIdAndUpdate(project.team._id, { users: team })
    }
    const updatedProject = await ProjectSchema.findById(project._id)
      .populate({
        path: 'pm',
        model: 'User',
      })
      .populate({
        path: 'creator',
        model: 'User',
      })
      .populate({
        path: 'team',
        model: 'Team',
        populate: {
          path: 'users',
          model: 'User',
        },
      });
    return updatedProject;
  }

  async getProjectTeam(projectId) {
    let project = await this.getProject(projectId);
    project = await ProjectSchema.populate(project, [
      {
        path: 'team',
        model: 'Team',
        populate: {
          path: 'users',
          model: 'User'
        }
      }
    ]);
    return project?.team?.users;
  }

  async getProjectPM(projectId) {
    let project = await this.getProject(projectId);
    project = await ProjectSchema.populate(project, [
      { path: 'pm', model: 'User' }
    ]);
    return project.pm;
  }
}
export default new ProjectService();
