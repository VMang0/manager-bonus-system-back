import BonusRequestSchema from '../../entites/BonusRequestSchema.js';

class ByCategoryService {
  async getDefaultData(companyId) {
    const requests = await BonusRequestSchema.find()
      .populate({
        path: 'bonus',
        match: { company: companyId },
      })
      .exec();
    const categoryCounts = {};
    requests.forEach(request => {
      if (request.bonus && request.bonus.category) {
        const category = request.bonus.category;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });
    return categoryCounts;
  }
}

export default new ByCategoryService();