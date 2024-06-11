import userService from "../services/UserService.js";

class UserController {

  async getUser(req, res, next) {
    try {
      const { user } = req;
      const userData = await userService.getUser(user.id);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async addUserInformation(req, res, next) {
    try {
      const userData = await userService.addUserInformation(req.body);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUsersForActivate(req, res, next) {
    try {
      const { user } = req;
      const users = await userService.getUsersForActivate(user.id);
      return res.json(users);
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

  async addManager(req, res, next) {
    try {
      const { email, companyId } = req.body;
      const userData = await userService.addManager(email, companyId);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getPMs(req, res, next) {
    try {
      const { user } = req;
      const pms = await userService.getPms(user.id);
      return res.json(pms);
    } catch (e) {
      next(e);
    }
  }

  async getEmployeesWithoutPms(req, res, next) {
    try {
      const { user } = req;
      const pms = await userService.getEmployeesWithoutPms(user.id);
      return res.json(pms);
    } catch (e) {
      next(e);
    }
  }

  async getEmployeesForCompany(req, res, next) {
    try {
      const { user } = req;
      const employees = await userService.getEmployeesForCompany(user.company);
      return res.json(employees);
    } catch (e) {
      next(e);
    }
  }

  async updateImage (req, res, next) {
    try {
      const { user } = req;
      const { avatar } = req.files;
      const url = await userService.updateImage(user, avatar);
      return res.json(url);
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
