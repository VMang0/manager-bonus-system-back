import CompanySettingsSchema from "../entites/CompanySettingsSchema.js";
import ApiErrors from "../exceptions/api-errors.js";
import CompanySchema from "../entites/CompanySchema.js";
import TaskService from "./TaskService.js";

class CompanySettingsService {
  async add(companyId, settings) {
    const company = await CompanySchema.findById(companyId);
    if (!company) {
      throw ApiErrors.BadRequest('Компания не найдена')
    }
    const companySettings = await CompanySettingsSchema.create({ company , settings });
    return companySettings;
  }

  async getOne(companyId) {
    const company = await CompanySchema.findById(companyId);
    if (!company) {
      throw ApiErrors.BadRequest('Компания не найдена')
    }
    const companySettings = await CompanySettingsSchema.findOne({ company });
    return companySettings;
  }

  async getAll() {
    const companiesSettings = await CompanySettingsSchema.find();
    return companiesSettings;
  }

  async update(settings) {
    const settCompany = await CompanySettingsSchema.findById(settings._id);
    if (!settCompany) {
      throw ApiErrors.BadRequest('Настройки для организации не найдены')
    }
    const companySettings = await CompanySettingsSchema.findByIdAndUpdate(
      settings._id,
      {
        'settings.priority.critical': settings.settings.priority.critical,
        'settings.priority.high': settings.settings.priority.high,
        'settings.priority.normal': settings.settings.priority.normal,
        'settings.complexity.low': settings.settings.complexity.low,
        'settings.complexity.medium': settings.settings.complexity.medium,
        'settings.complexity.high': settings.settings.complexity.high,
        'settings.success.first': settings.settings.success.first,
        'settings.success.second': settings.settings.success.second,
        'settings.success.more': settings.settings.success.more,
      },
      { new: true }
    );
    return companySettings;
  }

  async culcBall(settings, companyId) {
    const { priority, complexity, dateStart, deadline, attempt } = settings;
    const hours = await TaskService.culcHours(dateStart, deadline);
    const company = await CompanySchema.findById(companyId);
    const ball = await TaskService.calcBall(company, priority.name, hours, complexity.name, attempt)
    return ball;
  }
}
export default new CompanySettingsService();