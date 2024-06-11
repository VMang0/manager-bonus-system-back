import ApiErrors from "../exceptions/api-errors.js";
import BonusRequestSchema from "../entites/BonusRequestSchema.js";
import {dateConvert} from "../config/date-convert/index.js";
import UserSchema from "../entites/UserSchema.js";
import bonusService from './BonusService.js';
import userService from './UserService.js';
class BonusRequestService {

  async getBonusRequest(requestId) {
    const request = await BonusRequestSchema.findById(requestId)
      .populate({
        path: 'bonus',
        model: 'Bonus'
      });
    if (!request) {
      throw ApiErrors.BadRequest(`Произошла ошибка при получении запроса!`)
    }
    return request;
  }

  async add(requestInfo, userId) {
    const user = await userService.getUser(userId);
    const bonus = await bonusService.getBonus(requestInfo.bonusId);
    const newScope = Number(user.scope || 0) - Number(bonus.price);
    if (newScope < 0) {
      throw ApiErrors.BadRequest(`На балансе недостаточно баллов для приобретения!`);
    }
    if (bonus.rank > user.rank) {
      throw ApiErrors.BadRequest(`Для вашего уровня данный бонус недоступен!`)
    }
    await UserSchema.findByIdAndUpdate(user.id, { scope: newScope }, {new: true});
    const finish = this.calcFinishDate(requestInfo.startDate, bonus.duration);
    const request = await BonusRequestSchema.create(
      {
        ...requestInfo,
        finishDate: finish,
        bonus: bonus._id,
        user: user.id
      });
    return request;
  }

  calcFinishDate(startDate, duration) {
    const [day, month, year] = startDate.split('-').map(Number);
    const finish = new Date(year, month - 1, day);

    switch (duration) {
      case '1 год':
        finish.setFullYear(finish.getFullYear() + 1);
        break;
      case '1 месяц':
        finish.setMonth(finish.getMonth() + 1);
        break;
      case '1 неделя':
        finish.setDate(finish.getDate() + 7);
        break;
      case '1 день':
        finish.setDate(finish.getDate() + 1);
        break;
      default:
        throw new Error('Неизвестная продолжительность: ' + duration);
    }
    const finishDay = String(finish.getDate()).padStart(2, '0');
    const finishMonth = String(finish.getMonth() + 1).padStart(2, '0');
    const finishYear = finish.getFullYear();

    return `${finishDay}-${finishMonth}-${finishYear}`;
  }

  async getAll({ role, company, id }) {
    let condition = { user: id };

    if (role === 'manager') {
      const usersInCompany = await UserSchema.find({ company }).select('_id');
      const userIds = usersInCompany.map(user => user._id);
      condition = { user: { $in: userIds } };
    }

    const requests = await BonusRequestSchema.find(condition)
      .populate({
        path: 'bonus',
        match: { company },
        populate: {
          path: 'company',
        }
      })
      .populate({
        path: 'user',
        model: 'User',
      });
    const filteredRequests = requests.filter(request => request.bonus && request.bonus.company.equals(company));
    return filteredRequests;
  }

  async updateRequest({ id, ...info }, user) {
    const processedBy = await UserSchema.findById(user.id);
    const bonusRequest = await this.getBonusRequest(id);
    if (info.status === 'reject') {
      const bonusForUser = await UserSchema.findById(bonusRequest.user);
      const newScope = Number(bonusForUser.scope || 0) + Number(bonusRequest.bonus.price);
      await UserSchema.findByIdAndUpdate(bonusRequest.user, { scope: newScope });
    }
    const updatedRequest = await BonusRequestSchema.findByIdAndUpdate(id,
      { ...info, processingDate: dateConvert(new Date()), processedBy }, { new: true })
      .populate({
        path: 'bonus',
        model: 'Bonus'
      })
      .populate({
        path: 'user',
        model: 'User',
      });
    return updatedRequest;
  }

  async expiredRequest() {
    try {
      const currentDate = new Date();
      const requests = await BonusRequestSchema.find({
        status: { $in: ['allow'] },
      });
      requests.map(async (request) => {
        const [day, month, year] = request.finishDate.split('-');
        const finishDate = new Date(year, month - 1, day);
        const isExpired = currentDate > finishDate;
        if (isExpired) {
          await BonusRequestSchema.findByIdAndUpdate(request._id, { status: 'expired' });
        }
      });
    } catch (e) {
      console.log(e)
    }
  }

  /*
   async getTop5PopularBonusesThisMonth(companyId) {
     const startOfMonth = new Date();
     startOfMonth.setUTCHours(0, 0, 0, 0);
     startOfMonth.setDate(1);

     const endOfMonth = new Date();
     endOfMonth.setUTCHours(23, 59, 59, 999);
     endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);
     const top5Bonuses = await BonusRequestSchema.aggregate([
       {
         $match: {
           'bonus.company': new mongoose.Types.ObjectId(companyId),
           'status': { $in: ['allow', 'expired'] },
           'createdAt': { $gte: startOfMonth, $lte: endOfMonth }
         }
       },
       {
         $group: {
           _id: '$bonus',
           count: { $sum: 1 }
         }
       },
       {
         $sort: { count: -1 }
       },
       {
         $limit: 5
       }
     ]);
     return top5Bonuses;
   }*/
}

export default new BonusRequestService();