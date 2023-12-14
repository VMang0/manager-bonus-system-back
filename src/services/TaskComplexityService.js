import TaskComplexitySchema from "../entites/TaskComplexitySchema.js";

class TaskComplexityService {
  async getAll() {
    const complexities = await TaskComplexitySchema.find();
    return complexities;
  }
}
export default new TaskComplexityService();