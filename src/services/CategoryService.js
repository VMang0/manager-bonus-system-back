import ApiErrors from "../exceptions/api-errors.js";
import ProjectCategorySchema from "../entites/ProjectCategorySchema.js";

class CategoryService {

  async add(name) {
    const findCategory = await ProjectCategorySchema.findOne({name})
    if (findCategory) {
      throw ApiErrors.BadRequest(`Категория ${name} уже существует!`)
    }
    const category = await ProjectCategorySchema.create({name});
    return category;
  }

  async getAll() {
    const categories = await ProjectCategorySchema.find();
    return categories;
  }

}

export default new CategoryService();