import UserSchema from "../entites/UserSchema.js";
import bcrypt from 'bcrypt';
import {v4} from 'uuid';
import mailService from "./MailService.js";
import tokenService from "./TokenService.js";
import UserDTO from "../dtos/UserDTO.js";
import ApiErrors from "../exceptions/api-errors.js";
import userInfoService from "./UserInfoService.js";
import CompanySchema from "../entites/CompanySchema.js";
import UserInfoSchema from "../entites/UserInfoSchema.js";

class UserService {

  async registration(email, password, companyName, role) {
    const candidate = await UserSchema.findOne({email})
    if(candidate) {
      throw ApiErrors.BadRequest(`Пользователь с почтовым индексов ${email} уже существует`)
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = v4();
    const company = await CompanySchema.findOne({name: companyName})
    const user = await UserSchema.create({email, password: hashPassword, activationLink, company: company._id, role});
    const userDto = new UserDTO(user);
    const tokens = tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return{...tokens, user: userDto}
  }

  async login(email, password) {
    const user = await UserSchema.findOne({ email });
    if (!user) {
      throw ApiErrors.BadRequest('Пользователь с таким email не найден')
    }
    if(!user.isActivated){
      throw ApiErrors.BadRequest('Аккаунт не активирован менеджером')
    }
    const isPasswordEquals = await bcrypt.compare(password, user.password);
    if (!isPasswordEquals) {
      throw ApiErrors.BadRequest('Введен неверный пароль')
    }
    const userDto = new UserDTO(user);
    const tokens = tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return{...tokens, user: userDto}
  }

  async logout(refreshToken) {
    return tokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiErrors.UnauthorizedError();
    }
    const userData = tokenService.validationRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiErrors.UnauthorizedError();
    }
    const user = await UserSchema.findById(userData.id);
    const userDto = new UserDTO(user);
    const tokens = tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {...tokens, user: userDto}
  }

  async getUsersForActivate(company_id) {
    return UserSchema.find({company: company_id, isActivated: false, role: 'employee'});
  }

  async verify(id, info) {
    const user = await UserSchema.findById(id);
    if(!user) {
      throw ApiErrors.BadRequest('Пользователь не найден!')
    }
    if(user.isActivated) {
      throw ApiErrors.BadRequest('Пользователь активирован!')
    }
    const userInfo = await userInfoService.add(info);
    const updatedUser = await UserSchema.findByIdAndUpdate(user._id, {isActivated: true, info: userInfo._id, scope: 0});
    await mailService.sendVerifyInfo(user.email);
    return UserSchema.find({company: updatedUser.company, isActivated: false, role: 'employee'});
  }

  async addManager(email, company) {
    const candidate = await UserSchema.findOne({email})
    if(candidate) {
      throw ApiErrors.BadRequest(`Пользователь с почтовым индексов ${email} уже существует`)
    }
    const activationLink = v4();
    const companyFind = await CompanySchema.findOne({name: company});

    const user = await UserSchema.create({email, activationLink, role: 'manager', company: companyFind._id });
    await mailService.sendActivationMail(email, `${process.env.CLIENT_URL}/registration/${activationLink}`);
    return user;
  }

  async verifyManager(link, email, password, companyName) {
    const candidate = await UserSchema.findOne({email})
    if(candidate && candidate.password) {
      throw ApiErrors.BadRequest(`Пользователь с почтовым индексов ${email} уже существует`)
    }
    const company = await CompanySchema.findById(candidate.company)
    if (company.name !== companyName) {
      throw ApiErrors.BadRequest(`Ваш аккаунт не связан с компанией ${companyName}`)
    }
    if(candidate.activationLink !== link) {
      throw ApiErrors.BadRequest('Некорректная ссылка активация')
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const updatedUser = await UserSchema.findByIdAndUpdate(candidate._id, {isActivated: true, password: hashPassword });
    const userDto = new UserDTO(updatedUser);
    const tokens = tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return{user: userDto}
  }

  async getUserInfo(id) {
    const candidate = await UserSchema.findById(id)
    if(!candidate) {
      throw ApiErrors.BadRequest(`Пользователя не существует`)
    }
    const userInfo = UserInfoSchema.findById(candidate.info);
    if(!userInfo) {
      throw ApiErrors.BadRequest(`У пользователя нет дополнительной информации`)
    }
    return userInfo;
  }

  async getManagers() {
    return UserSchema.find({isActivated: true, role: 'manager'})
      .populate('company')
      .populate('info');
  }
  async getEmployeesForCompany(company) {
    const users = await UserSchema.find({isActivated: true, role: 'employee', company})
      .populate('company')
      .populate('info');
    const pm = users.filter(user => {
      return user.info.position === 'Project manager';
    });
    const employees = users.filter(user => {
      return user.info.position !== 'Project manager';
    });
    return { pm, employees}
  }
}

export default new UserService();
