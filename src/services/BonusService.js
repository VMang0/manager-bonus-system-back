import BonusShema from "../entites/BonusShema.js";

class BonusService {
  async add(info) {
    const bonus = await BonusShema.create(info);
    const newBonus = await BonusShema.findById(bonus._id).populate('duration');
    return newBonus;
  }
  async getAll(id) {
    const bonus = await BonusShema.find({ company: id }).populate('duration')
    return bonus;
  }
}

export default new BonusService();