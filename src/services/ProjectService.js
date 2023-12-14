import ProjectSchema from "../entites/ProjectSchema.js";
import TeamSchema from "../entites/TeamSchema.js";
import ApiErrors from "../exceptions/api-errors.js";
import UserSchema from "../entites/UserSchema.js";
import {dateEndConvert} from "../config/date-convert/index.js";

class ProjectService {
  async add(team, projectInfo) {
    const project = await ProjectSchema.create({...projectInfo, dateFinish: dateEndConvert(projectInfo.dateFinish)});
    if (team.length > 0) {
      team.map( async (employee) => {
        await TeamSchema.create({ user: employee, project: project._id })
      });
    }
    return ProjectSchema.findById(project._id)
      .populate('category')
      .populate('priority')
      .populate({
        path: 'creator',
        model: 'User',
        populate: {
          path: 'info',
          model: 'UserInfo'
        }})
      .populate({
        path: 'pm',
        model: 'User',
        populate: {
          path: 'info',
          model: 'UserInfo'
        }});
  }

  async getAll() {
    const projects = await ProjectSchema.find()
      .populate('category')
      .populate('priority')
      .populate({
        path: 'pm',
        model: 'User',
        populate: {
          path: 'info',
          model: 'UserInfo'
        }})
      .populate({
          path: 'creator',
          model: 'User',
          populate: {
            path: 'info',
            model: 'UserInfo'
          }});
    return projects;
  }

  async getProjectsByParam(parametr) {
    const projects = await ProjectSchema.find(parametr)
      .populate('category')
      .populate('priority')
      .populate({
        path: 'pm',
        model: 'User',
        populate: {
          path: 'info',
          model: 'UserInfo'
        }})
      .populate({
        path: 'creator',
        model: 'User',
        populate: {
          path: 'info',
          model: 'UserInfo'
        }});
    return projects;
  }
  async getProjectsById(id) {
    const projects = await ProjectSchema.findById(id)
      .populate('category')
      .populate('priority')
      .populate({
        path: 'pm',
        model: 'User',
        populate: {
          path: 'info',
          model: 'UserInfo'
        }})
      .populate({
        path: 'creator',
        model: 'User',
        populate: {
          path: 'info',
          model: 'UserInfo'
        }});
    return projects;
  }

  async getAllUsersProject(id) {
    const user = await UserSchema.findById(id).populate('info');
    if (!user) {
      throw ApiErrors.BadRequest(`Данного пользователя не существует в системе!`)
    }
    if (user.info.position === 'Project manager'){
      return await this.getProjectsByParam({ pm: user._id })
    } else {
      const team = await TeamSchema.find({ user: id })
      const projectsIds = team.map(item => item.project);
      const projects = await Promise.all(
        projectsIds.map(async (item) => {
          return await this.getProjectsById(item);
        })
      );
      return projects;
    }
  }

  async getProjectTeam() {
    const teams = await TeamSchema.find()
      .populate({
        path: 'user',
        model: 'User',
        populate: {
          path: 'info',
          model: 'UserInfo'
        }});

    const teamGroup = teams.reduce((acc, current) => {
      const projectId = current.project.toString();
      const existingGroup = acc.find(group => {
        return group._id.toString() === projectId;
      });
      if (existingGroup) {
        existingGroup.team.push(current.user);
      } else {
        acc.push({
          _id: projectId,
          team: [current.user]
        });
      }
      return acc;
    }, []);
    return teamGroup;
  }

  async updateTeamMembers (project, updatedTeamIds) {
    const currentTeam = await TeamSchema.find({ project: project._id });
    const currentTeamIds = currentTeam.map((teamMember) => teamMember.user.toString());

    const newMembers = updatedTeamIds.filter((teamMember) => !currentTeamIds.includes(teamMember.toString()));
    const removedMembers = currentTeam.filter((teamMember) => !updatedTeamIds.includes(teamMember.user.toString()));

    await TeamSchema.insertMany(newMembers.map((employee) => ({ user: employee, project: project._id })));
    await TeamSchema.deleteMany({ _id: { $in: removedMembers.map((teamMember) => teamMember._id) } });
  }

  async update(team, projectInfo) {
    const project = await ProjectSchema.findByIdAndUpdate(projectInfo._id, projectInfo);
    if (!project) {
      throw ApiErrors.BadRequest(`Проект ${projectInfo.name} не найден в системе!`)
    }
    await this.updateTeamMembers(projectInfo, team);
    return ProjectSchema.findById(projectInfo._id)
      .populate('category')
      .populate('priority')
      .populate({
        path: 'pm',
        model: 'User',
        populate: {
          path: 'info',
          model: 'UserInfo'
        }})
      .populate({
        path: 'creator',
        model: 'User',
        populate: {
          path: 'info',
          model: 'UserInfo'
        }});
  }

  async delete(id) {
    const project = await ProjectSchema.findById(id);
    if (!project) {
      throw ApiErrors.BadRequest(`Проект не найден в системе!`)
    }
    const currentTeam = await TeamSchema.find({ project: id });
    await TeamSchema.deleteMany({ _id: { $in: currentTeam.map((teamMember) => teamMember._id) } });
    return ProjectSchema.findByIdAndDelete(id);
  }
}
export default new ProjectService();
