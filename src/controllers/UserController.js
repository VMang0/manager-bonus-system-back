import userService from "../services/UserService.js";
import {validationResult} from "express-validator";
import ApiErrors from "../exceptions/api-errors.js";
import tokenSchema from "../entites/TokenSchema.js";

class UserController {

  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
       if(!errors.isEmpty()) {
         return next(ApiErrors.BadRequest('Ошибка при валидации', errors.array()))
       }
      const {email, password, company, role} = req.body;
      const userData = await userService.registration(email, password, company, role);
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
  async activate(req, res,next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL)
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
  async getUsers(req, res, next) {
    try {
      const users = await userService.getAll();
      return res.json(users);
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

  /*async create(req, res){
    await UserService.create(req.body)
      .then(user => res.json(user))
      .catch(e => res.status(500).json(e))
  }

  async getAll(req, res) {
    await UserService.getAll()
      .then(users => res.json(users))
      .catch(e => res.status(500).json(e))
  }

  async getOne(req, res) {
    await UserService.getOne(req.params.id)
      .then(user => res.json(user))
      .catch(e => res.status(500).json(e))
  }

  async update(req, res) {
    await UserService.update(req.body)
      .then(user => res.json(user))
      .catch(e => res.status(500).json(e.message))
  }

  async delete(req, res) {
    await UserService.delete(req.params.id)
      .then(user => res.json(user))
      .catch(e => res.status(500).json(e))
  }*/

}

export default new UserController();
