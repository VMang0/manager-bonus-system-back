import categoryService from "../services/CategoryService.js";

class CategoryController {
  async add(req, res, next) {
    try {
      const {name} = req.body;
      const category = await categoryService.add(name);
      return res.json(category);
    } catch (e) {
      next(e);
    }
  }
  async getAll(req, res, next) {
    try {
      const category = await categoryService.getAll();
      return res.json(category);
    } catch (e) {
      next(e);
    }
  }
}

export default new CategoryController()