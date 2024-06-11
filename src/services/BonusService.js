import BonusShema from "../entites/BonusShema.js";
import CompanySchema from "../entites/CompanySchema.js";
import ApiErrors from "../exceptions/api-errors.js";
import companyService from './CompanyService.js';

class BonusService {

  async getBonus(bonusId) {
    const bonus = await BonusShema.findById(bonusId);
    if (!bonus) {
      throw ApiErrors.BadRequest(`Произошла ошибка при получении бонуса!`)
    }
    return bonus;
  }

  async add(bonusInfo, companyId) {
    const company = await companyService.getCompany(companyId);
    const bonus = await BonusShema.create({ ...bonusInfo, company });
    return bonus;
  }

  async update(bonusInfo) {
    await this.getBonus(bonusInfo.id);
    const updatedBonus = await BonusShema.findByIdAndUpdate(bonusInfo.id, bonusInfo, { new: true });
    return updatedBonus;
  }

  async updateStatus(bonusId) {
    const bonus = await this.getBonus(bonusId);
    const updatedBonus = await BonusShema.findByIdAndUpdate(bonusId, { isView: !bonus.isView }, { new: true });
    return updatedBonus;
  }
  
  async getAll(user) {
    await companyService.getCompany(user.company);
    let request = { company: user.company };
    if (user.role === 'employee') request = { ...request, isView: true }
    const bonuses = await BonusShema.find(request);
    return bonuses;
  }
}

export default new BonusService();