import companySettingsService from "../services/CompanySettingsService.js";

class CompanySettingsController {

  async getSettings(req, res, next){
    try {
      const { user } = req;
      const settings = await companySettingsService.getSettings(user.company);
      return res.json(settings);
    } catch (e) {
      next(e)
    }
  }

  async updateSettings(req, res, next){
    try {
      const { user } = req;
      const settings = req.body;
      const setting = await companySettingsService.updateSettings(user, settings);
      return res.json(setting);
    } catch (e) {
      next(e)
    }
  }
  async calculateBall(req, res, next){
    try {
      const { user } = req;
      const settings = req.body;
      const ball = await companySettingsService.calculateBall(user, settings);
      return res.json(ball);
    } catch (e) {
      next(e)
    }
  }

}

export default new CompanySettingsController();