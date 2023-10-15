import Company from "../entites/Company.js";

class CompanyService {

  async create(company){
    const  createdCompany = await Company.create(company)
    return createdCompany;
  }

  async getAll() {
    const companies = await Company.find();
    return companies;
  }

  async getOne(id) {
    if (!id) {
      throw new Error('id не указан ');
    }
    const company = await Company.findById(id);
    return company;
  }

  async update(company) {
    if (!company._id) {
      throw new Error('id не указан ');
    }
    const updatedCompany = await Company.findByIdAndUpdate(company._id, company);
    return updatedCompany;
  }

  async delete(id) {
    if (!id) {
      throw new Error('id не указан ');
    }
    const company = await Company.findByIdAndDelete(id);
    return company;
  }

}

export default new CompanyService();