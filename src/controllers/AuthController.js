import { validationResult } from 'express-validator';
import ApiErrors from '../exceptions/api-errors.js';
import authService from '../services/AuthService.js';

class AuthController {

  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return next(ApiErrors.BadRequest('Ошибка при валидации', errors.array()))
      }
      await authService.registration(req.body);
      return res.json();
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const {email, password} = req.body;
      const userData = await authService.login(email, password);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async verifyManager(req, res, next) {
    try {
      const userData = await authService.verifyManager(req.body);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
}

export default new AuthController();