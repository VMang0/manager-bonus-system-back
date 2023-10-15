import UserService from "../services/UserService.js";

class UserController {

  async create(req, res){
    await UserService.create(req.body)
      .then(user => res.json(user))
      .catch(e => res.status(500).json(e))
  }

  async getAll(req, res) {
    await UserService.getAll()
      .then(users => res.json(users))
      .catch(e => res.status(500).json(e))
  }

  async getOne(req, res) {
    await UserService.getOne(req.params.id)
      .then(user => res.json(user))
      .catch(e => res.status(500).json(e))
  }

  async update(req, res) {
    await UserService.update(req.body)
      .then(user => res.json(user))
      .catch(e => res.status(500).json(e.message))
  }

  async delete(req, res) {
    await UserService.delete(req.params.id)
      .then(user => res.json(user))
      .catch(e => res.status(500).json(e))
  }

}

export default new UserController();