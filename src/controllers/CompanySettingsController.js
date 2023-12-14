import companySettingsService from "../services/CompanySettingsService.js";

class CompanySettingsController {

  async add(req, res, next){
    try {
      const { company, settings } = req.body;
      const settin = await companySettingsService.add(company, settings);
      return res.json(settin);
    } catch (e) {
      next(e)
    }
  }

  async getOne(req, res, next){
    try {
      const company = req.params.companyId;
      const settings = await companySettingsService.getOne(company);
      return res.json(settings);
    } catch (e) {
      next(e)
    }
  }

  async getAll(req, res, next){
    try {
      const setting = await companySettingsService.getAll();
      return res.json(setting);
    } catch (e) {
      next(e)
    }
  }

  async update(req, res, next){
    try {
      const settings = req.body;
      const setting = await companySettingsService.update(settings);
      return res.json(setting);
    } catch (e) {
      next(e)
    }
  }
  async culcBall(req, res, next){
    try {
      const companyId = req.params.companyId;
      const settings = req.body;
      const ball = await companySettingsService.culcBall(settings, companyId);
      return res.json(ball);
    } catch (e) {
      next(e)
    }
  }

}

export default new CompanySettingsController();