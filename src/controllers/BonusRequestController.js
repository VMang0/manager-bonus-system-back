import bonusRequestService from "../services/BonusRequestService.js";

class BonusRequestController {

  async add(req, res, next) {
    try {
      const { user } = req;
      const newRequest = await bonusRequestService.add(req.body, user.id);
      return res.json(newRequest);
    } catch (e) {
      next(e);
    }
  }

  async getAll(req, res, next) {
    try {
      const { user } = req;
      const requests = await bonusRequestService.getAll(user);
      return res.json(requests);
    } catch (e) {
      next(e);
    }
  }

  async updateRequest(req, res, next) {
    try {
      const { user } = req;
      const updateRequest = await bonusRequestService.updateRequest(req.body, user);
      return res.json(updateRequest);
    } catch (e) {
      next(e);
    }
  }

  async getTop5PopularBonusesThisMonth(req, res, next) {
    try {
      const companyId = req.params.companyId;
      const top5 = await bonusRequestService.getTop5PopularBonusesThisMonth(companyId);
      return res.json(top5);
    } catch (e) {
      next(e);
    }
  }
}

export default new BonusRequestController();