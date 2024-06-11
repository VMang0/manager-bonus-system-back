import BonusRequestSchema from '../../entites/BonusRequestSchema.js';
import BonusSchema from '../../entites/BonusShema.js';

class ByMonthService {
  async getDefaultData(companyId) {
    const currentYear = new Date().getFullYear();
    const bonusIds = await BonusSchema.find({ company: companyId }, '_id').exec();

    const currentYearRequests = await BonusRequestSchema.find({
      bonus: { $in: bonusIds },
      createdAt: {
        $gte: new Date(currentYear, 0, 1),
        $lt: new Date(currentYear + 1, 0, 1),
      },
    }).exec();

    const previousYearRequests = await BonusRequestSchema.find({
      bonus: { $in: bonusIds },
      createdAt: {
        $gte: new Date(currentYear - 1, 0, 1),
        $lt: new Date(currentYear, 0, 1),
      },
    }).exec();

    const currentYearData = await this.groupDataByMonth(currentYearRequests);
    const previousYearData = await this.groupDataByMonth(previousYearRequests);

    const mergedData = await this.mergeDataByMonth(currentYearData, previousYearData);
    return mergedData;
  }

  async groupDataByMonth(requests) {
    const groupedData = requests.reduce((acc, request) => {
      const month = new Date(request.createdAt).getMonth() + 1;
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    return groupedData;
  };

  async mergeDataByMonth(currentYearData, previousYearData) {
    const mergedData = [];
    for (let month = 1; month <= 12; month++) {
      mergedData.push({
        month,
        currentYear: currentYearData[month] || 0,
        previousYear: previousYearData[month] || 0,
      });
    }
    return mergedData;
  };

}

export default new ByMonthService();