import UserSchema from '../entites/UserSchema.js';
import ApiErrors from '../exceptions/api-errors.js';
import bcrypt from 'bcrypt';
import CompanyService from './CompanyService.js';
import UserDTO from '../dtos/UserDTO.js';
import tokenService from './TokenService.js';

class AuthService {

  async registration({ email, password, companyId, role }) {
    const candidate = await UserSchema.findOne({email})
    if(candidate) {
      throw ApiErrors.BadRequest(`Пользователь с почтовым индексов ${email} уже существует`)
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const company = await CompanyService.getCompany(companyId);
    const user = await UserSchema.create({email, password: hashPassword, company, role});
    return user;
  }

  async login(email, password) {
    const user = await UserSchema.findOne({ email });
    if (!user) {
      throw ApiErrors.BadRequest('Пользователь с таким email не найден')
    }
    if (!user.isActivated) {
      throw ApiErrors.BadRequest('Аккаунт не активирован!')
    }
    const isPasswordEquals = await bcrypt.compare(password, user.password);
    if (!isPasswordEquals) {
      throw ApiErrors.BadRequest('Введен неверный пароль')
    }
    const userDto = new UserDTO(user);
    const token = tokenService.generateToken({...userDto});
    return { token: token , user: userDto}
  }

  async verifyManager({ link, email, password, companyId }) {
    if (link === '' || email === '' || password === '' || !companyId) {
      throw ApiErrors.BadRequest(`Проверьте корректность введенных данных`)
    }

    const manager = await UserSchema.findOne({ email })
    if (!manager) {
      throw ApiErrors.BadRequest(`Пользователя с почтовым адресом ${email} нет в системе`)
    }
    if (manager.isActivated) {
      throw ApiErrors.BadRequest(`Аккаунт с почтовым адресом ${email} уже активирован`)
    }

    const managerCompany = await CompanyService.getCompany(manager.company);
    const inputsCompany = await CompanyService.getCompany(companyId);
    if (managerCompany.name !== inputsCompany.name) {
      throw ApiErrors.BadRequest(`Ваш аккаунт не связан с компанией ${inputsCompany.name}`)
    }
    if(manager.activationLink !== link) {
      throw ApiErrors.BadRequest('Некорректная ссылка активация')
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const updatedUser = await UserSchema.findByIdAndUpdate(manager._id, {isActivated: true, password: hashPassword });
    const userDto = new UserDTO(updatedUser);
    return { user: userDto }
  }

}

export default new AuthService();