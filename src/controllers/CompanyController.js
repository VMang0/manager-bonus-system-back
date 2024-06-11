import companyService from "../services/CompanyService.js";
import {validationResult} from "express-validator";
import ApiErrors from "../exceptions/api-errors.js";

class CompanyController {

  async add(req, res, next){
    try {
      const { name } = req.body;
      const company = await companyService.add(name);
      return res.json(company);
    } catch (e) {
      next(e)
    }
  }

  async getAll(req, res, next){
    try {
      const companies = await companyService.getAll();
      return res.json(companies);
    } catch (e) {
      next(e)
    }
  }
}

export default new CompanyController()