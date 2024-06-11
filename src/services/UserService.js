import UserSchema from "../entites/UserSchema.js";
import {v4} from 'uuid';
import mailService from "./MailService.js";
import ApiErrors from "../exceptions/api-errors.js";
import CompanySchema from "../entites/CompanySchema.js";
import UserDTO from '../dtos/UserDTO.js';
import cloudinaryService from './CloudinaryService.js';

class UserService {

  async getUser(userId) {
    const user =  await UserSchema.findById(userId);
    if (!user) {
      throw ApiErrors.BadRequest(`Пользователь не найден`)
    }
    return new UserDTO(user);
  }

  async addUserInformation({ id, ...data }) {
    const updatedUser = await UserSchema.findByIdAndUpdate(id, { isActivated: true, ...data, scope: 0 });
    if (updatedUser.role === 'employee') await mailService.sendVerifyInfo(updatedUser.email);
    return new UserDTO(updatedUser);
  }

  async getUsersForActivate(userId) {
    const user = await this.getUser(userId);
    return UserSchema.find({ company: user.company, isActivated: false, role: 'employee' });
  }

  async addManager(email, companyId) {
    if (email === '' || !companyId) {
      throw ApiErrors.BadRequest(`Проверьте корректность введенных данных`)
    }
    const candidate = await UserSchema.findOne({email})
    if(candidate) {
      throw ApiErrors.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
    }
    const activationLink = v4();
    const companyFind = await CompanySchema.findById(companyId);
    if(!companyFind) {
      throw ApiErrors.BadRequest(`Организации ${companyFind.name} не существует в системе!`)
    }
    const user = await UserSchema.create({email, activationLink, role: 'manager', company: companyFind._id })
    await mailService.sendActivationMail(email, `${process.env.CLIENT_URL}/registration/${activationLink}`);
    return await user.populate('company');
  }

  async getManagers() {
    const managers = await UserSchema.find({ role: 'manager' }).populate('company');
    return managers;
  }

  async getPms(userId) {
    const user = await this.getUser(userId);
    const pms =  UserSchema.find({ company: user.company, position: 'Project Manager', isActivated: true })
    return pms;
  }

  async getEmployeesWithoutPms(userId) {
    const user = await this.getUser(userId);
    const users = await UserSchema.find({
      company: user.company,
      role: 'employee',
      position: { $ne: 'Project Manager' },
      isActivated: true
    });
    return users;
  }

  async getEmployeesForCompany(companyId) {
    const users = await UserSchema.find({ isActivated: true, role: 'employee', company: companyId })
    return users;
  }

  async updateImage({ id }, image) {
    const url = await cloudinaryService.sendImage(image);
    const user = await UserSchema.findByIdAndUpdate(id, { image: url },  {new: true})
    return new UserDTO(user);
  }
}

export default new UserService();
