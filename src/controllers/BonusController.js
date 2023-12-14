import bonusService from "../services/BonusService.js";

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
  async update(req, res, next) {
    try {
      const bonus = req.body;
      const updateBonus = await bonusService.update(bonus);
      return res.json(updateBonus);
    } catch (e) {
      next(e);
    }
  }
  async delete(req, res, next) {
    try {
      const id = req.params.id;
      const newBonus = await bonusService.delete(id);
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
}
export default new BonusController();