import ChartsService from "../services/ChartsService.js";

class ChartsController {
  async getDataForLinecharts(req, res, next) {
    try {
      const companyId = req.params.companyId;
      const data = await ChartsService.getDataForLinecharts(companyId)
      return res.json(data);
    } catch (e) {
      next(e);
    }
  }
}

export default new ChartsController();