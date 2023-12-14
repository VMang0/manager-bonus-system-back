import ApiErrors from "../exceptions/api-errors.js";
import CompanySchema from "../entites/CompanySchema.js";
import CompanySettingsSchema from "../entites/CompanySettingsSchema.js";

class CompanyService {
  async add(name) {
    const company = await CompanySchema.findOne({ name })
    if (company) {
      throw ApiErrors.BadRequest(`Компания ${name} уже существует в системе!`)
    }
    const company_ = await CompanySchema.create({ name });
    await CompanySettingsSchema.create({ company: company_ })
    return company_;
  }
  async getAll() {
    const companies = await CompanySchema.find()
    return companies;
  }
}

export default new CompanyService();