import userService from "../services/UserService.js";
import {validationResult} from "express-validator";
import ApiErrors from "../exceptions/api-errors.js";

class UserController {

  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
       if(!errors.isEmpty()) {
         return next(ApiErrors.BadRequest('Ошибка при валидации', errors.array()))
       }
      const {email, password, chooseItem, role} = req.body;
      const userData = await userService.registration(email, password, chooseItem, role);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async login(req, res,next) {
    try {
      const {email, password} = req.body;
      const userData = await userService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async logout(req, res,next) {
    try {
      const {refreshToken} = req.cookies;
      const token = userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res,next) {
    try {
      const {refreshToken} = req.cookies;
      const userData  = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUsersForActivate(req, res, next) {
    try {
      const company = req.params.company;
      const users = await userService.getUsersForActivate(company);
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async verifyUser(req, res, next) {
    try {
      const {id, ...info} = req.body;
      const user = await userService.verify(id, info);
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async addManager(req, res, next) {
    try {
      const {email, company} = req.body;
      const userData = await userService.addManager(email, company);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async verifyManager(req, res, next) {
    try {
      const { link, email, password, company } = req.body;
      const userData = await userService.verifyManager(link, email, password, company);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async getUserInfo(req, res, next) {
    try {
      const id = req.params.id;
      const userData = await userService.getUserInfo(id);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async getManagers(req, res, next) {
    try {
      const userData = await userService.getManagers();
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getEmployeesForCompany(req, res, next) {
    try {
      const company = req.params.company;
      const userData = await userService.getEmployeesForCompany(company);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getEmployeesWithoutUsersAndManager(req, res, next) {
    try {
      const user = req.params.user;
      const project = req.params.project;
      const userData = await userService.getEmployeesWithoutUsersAndManager(user, project);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
