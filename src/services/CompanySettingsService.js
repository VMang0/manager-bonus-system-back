import CompanySettingsSchema from "../entites/CompanySettingsSchema.js";
import ApiErrors from "../exceptions/api-errors.js";
import CompanySchema from "../entites/CompanySchema.js";
import TaskService from "./TaskService.js";
import companyService from './CompanyService.js';

class CompanySettingsService {

  async getSettings(companyId) {
    const company = await companyService.getCompany(companyId);
    const companySettings = await CompanySettingsSchema.findOne({ company });
    if (!companySettings) {
      throw ApiErrors.BadRequest('Настройки не найдены для указанной компании.');
    }
    return companySettings?.settings;
  }

  async updateSettings(user, settings) {
    const company = await companyService.getCompany(user.company);
    const companySettings = await CompanySettingsSchema.findOne({ company });
    if (!companySettings) {
      throw ApiErrors.BadRequest('Настройки для организации не найдены')
    }
    const updatedSettings = await CompanySettingsSchema.findByIdAndUpdate(
      companySettings._id,
      {
        'settings.priority.critical': settings.priority.critical,
        'settings.priority.high': settings.priority.high,
        'settings.priority.normal': settings.priority.normal,
        'settings.complexity.low': settings.complexity.low,
        'settings.complexity.medium': settings.complexity.medium,
        'settings.complexity.high': settings.complexity.high,
        'settings.success.first': settings.success.first,
        'settings.success.second': settings.success.second,
        'settings.success.more': settings.success.more,
      },
      { new: true }
    );
    return updatedSettings.settings;
  }

  async calculateBall(user, data) {
    const dataForCalculation = {...data, spendEstimation: 0 };
    const ball = await TaskService.calcBall(user.company, dataForCalculation)
    return ball;
  }
}
export default new CompanySettingsService();