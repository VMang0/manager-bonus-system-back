import CompanyService from "../services/CompanyService.js";

class CompanyController {
  async create(req, res){
    await CompanyService.create(req.body)
      .then(company => res.json(company))
      .catch(e => res.status(500).json(e))
  }

  async getAll(req, res) {
    await CompanyService.getAll()
      .then(company => res.json(company))
      .catch(e => res.status(500).json(e))
  }

  async getOne(req, res) {
    await CompanyService.getOne(req.params.id)
      .then(company => res.json(company))
      .catch(e => res.status(500).json(e))
  }

  async update(req, res) {
    await CompanyService.update(req.body)
      .then(company => res.json(company))
      .catch(e => res.status(500).json(e.message))
  }

  async delete(req, res) {
    await CompanyService.delete(req.params.id)
      .then(company => res.json(company))
      .catch(e => res.status(500).json(e))
  }
}

export default new CompanyController();