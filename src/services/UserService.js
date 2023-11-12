import UserSchema from "../entites/UserSchema.js";
import bcrypt from 'bcrypt';
import {v4} from 'uuid';
import mailService from "./MailService.js";
import tokenService from "./TokenService.js";
import UserDTO from "../dtos/UserDTO.js";
import ApiErrors from "../exceptions/api-errors.js";
import tokenSchema from "../entites/TokenSchema.js";
import CompanySchema from "../entites/CompanySchema.js";
import userInfoService from "./UserInfoService.js";

class UserService {

  async registration(email, password, company, role) {
    const candidate = await UserSchema.findOne({email})
    if(candidate) {
      throw ApiErrors.BadRequest(`Пользователь с почтовым индексов ${email} уже существует`)
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = v4();
    const user = await UserSchema.create({email, password: hashPassword, activationLink, company, role});
    //await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
    const userDto = new UserDTO(user);
    const tokens = tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return{...tokens, user: userDto}
  }

  async activate(activationLink) {
    const user = await UserSchema.findOne({activationLink});
    if(!user) {
      throw ApiErrors.BadRequest('Некорректная ссылка активация')
    }
    user.isActivated = true;
    await user.save();
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
    const token = await tokenService.removeToken(refreshToken);
    return token;
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

  async getAll() {
    const users = await UserSchema.find();
    return users;
  }


  async getUsersForActivate(company_id) {
    const users = await UserSchema.find({company: company_id, isActivated: false, role: 'employee'});
    return users;
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
    const updatedUser = await UserSchema.findByIdAndUpdate(user._id, {isActivated: true, info: userInfo._id});
    await mailService.sendVerifyInfo(user.email);
    const users = await UserSchema.find({company: updatedUser.company, isActivated: false, role: 'employee'});
    return users;
  }

/*
  async create(user){
    /!*if (picture) {
      fileName = FileService.saveFile(picture);
    }*!/
    const  createdUser = await User.create({...user, status: false})
    return createdUser;
  }

  async getAll() {
    const users = await User.find().populate('company');
    return users;
  }

  async getOne(id) {
    if (!id) {
      throw new Error('id не указан ');
    }
    const user = await User.findById(id)
      .populate('company')
    return user;
  }

  async update(user) {
    if (!user._id) {
      throw new Error('id не указан ');
    }
    const updatedUser = await User.findByIdAndUpdate(user._id, user);
    return updatedUser;
  }

  async delete(id) {
    if (!id) {
      throw new Error('id не указан ');
    }
    const user = await User.findByIdAndDelete(id);
    return user;
  }
*/
}

export default new UserService();
