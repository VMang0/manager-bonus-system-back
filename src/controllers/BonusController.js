import projectService from "../services/ProjectService.js";
import bonusService from "../services/BonusService.js";
import DurationSchema from "../entites/DurationSchema.js";

class BonusController {
  async add(req, res, next) {
    try {
      const bonus = req.body;
      const newBonus = await bonusService.add(bonus);
      return res.json(newBonus);
    } catch (e) {
      next(e);
    }
  }
  async getAll(req, res, next) {
    try {
      const id = req.params.company;
      const bonuses = await bonusService.getAll(id);
      return res.json(bonuses);
    } catch (e) {
      next(e);
    }
  }
  async adddur(req, res, next) {
    try {
      const bonus = req.body;
      const newBonus = await DurationSchema.create(bonus);
      return res.json(newBonus);
    } catch (e) {
      next(e);
    }
  }
}
export default new BonusController();