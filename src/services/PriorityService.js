import PrioritySchema from "../entites/PrioritySchema.js";

class PriorityService {
  async getAll() {
    const priorities = await PrioritySchema.find();
    return priorities;
  }
}
export default new PriorityService();