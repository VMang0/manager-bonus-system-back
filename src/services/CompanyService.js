import ApiErrors from "../exceptions/api-errors.js";
import CompanySchema from "../entites/CompanySchema.js";
import CompanySettingsSchema from "../entites/CompanySettingsSchema.js";

class CompanyService {

  async getCompany(companyId) {
    if (!companyId) {
      throw ApiErrors.BadRequest(`Проверьте корректность введенных данных`)
    }
    const company = await CompanySchema.findById(companyId);
    if (!company) {
      throw ApiErrors.BadRequest(`Произошла ошибка! Компания не найдена!`)
    }
    return company;
  }

  async add(name) {
    if (name === '') {
      throw ApiErrors.BadRequest(`Проверьте корректность введенных данных`)
    }
    const company = await CompanySchema.findOne({ name })
    if (company) {
      throw ApiErrors.BadRequest(`Компания ${name} уже существует в системе!`)
    }
    const newCompany = await CompanySchema.create({ name });
    await CompanySettingsSchema.create({ company: newCompany });
    return newCompany;
  }

  async getAll() {
    const companies = await CompanySchema.find()
    return companies;
  }
}

export default new CompanyService();