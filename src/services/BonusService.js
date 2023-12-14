import BonusShema from "../entites/BonusShema.js";
import CompanySchema from "../entites/CompanySchema.js";
import ApiErrors from "../exceptions/api-errors.js";

class BonusService {
  async add(info) {
    const company = await CompanySchema.findById(info.company);
    if (!company) {
      throw ApiErrors.BadRequest(`Данной орагнизации нет в системе!`)
    }
    const bonus = await BonusShema.create(info);
    return bonus;
  }
  async update(info) {
    const bonus = await BonusShema.findById(info._id);
    if (!bonus) {
      throw ApiErrors.BadRequest(`Данного юонуса нет в системе!`)
    }
    await BonusShema.findByIdAndUpdate(info._id, info);
    const newBonus = await BonusShema.findById(info._id);
    return newBonus;
  }
  async delete(id) {
    const bonus = await BonusShema.findById(id);
    if (!bonus) {
      throw ApiErrors.BadRequest(`Данного юонуса нет в системе!`)
    }
    const newBonus = await BonusShema.findByIdAndUpdate(id, { isView: false });
    return newBonus;
  }
  async getAll(id) {
    const company = await CompanySchema.findById(id);
    if (!company) {
      throw ApiErrors.BadRequest(`Данной орагнизации нет в системе!`)
    }
    const bonus = await BonusShema.find({ company: id, isView: true });
    return bonus;
  }
}

export default new BonusService();