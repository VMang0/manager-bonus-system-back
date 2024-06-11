import byCategoryService from '../../services/analytic/ByCategoryService.js';
import byMonthService from '../../services/analytic/ByMonthService.js';

class ByMonthController {

  async getDefaultData(req, res, next) {
    try {
      const { user } = req;
      const data = await byMonthService.getDefaultData(user.company);
      return res.json(data);
    } catch (e) {
      next(e);
    }
  }

}

export default new ByMonthController();