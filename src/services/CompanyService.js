import ApiErrors from "../exceptions/api-errors.js";
import CompanySchema from "../entites/CompanySchema.js";

class CompanyService {

  async add(name) {
    const company = await CompanySchema.findOne({name})
    if (company) {
      throw ApiErrors.BadRequest(`Компания ${name} уже существует в системе!`)
    }
    const company_ = await CompanySchema.create({name});
    return company_;
  }
  async getAll() {
    const companies = await CompanySchema.find()
    return companies;
  }
}

export default new CompanyService();