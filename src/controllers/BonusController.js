import bonusService from "../services/BonusService.js";

class BonusController {

  async add(req, res, next) {
    try {
      const { user } = req;
      const newBonus = await bonusService.add(req.body, user.company);
      return res.json(newBonus);
    } catch (e) {
      next(e);
    }
  }
  async update(req, res, next) {
    try {
      const updateBonus = await bonusService.update(req.body);
      return res.json(updateBonus);
    } catch (e) {
      next(e);
    }
  }
  async updateStatus(req, res, next) {
    try {
      const { bonusId } = req.params;
      const newBonus = await bonusService.updateStatus(bonusId);
      return res.json(newBonus);
    } catch (e) {
      next(e);
    }
  }
  async getAll(req, res, next) {
    try {
      const { user } = req;
      const bonuses = await bonusService.getAll(user);
      return res.json(bonuses);
    } catch (e) {
      next(e);
    }
  }
}
export default new BonusController();