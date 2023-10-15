import User from "../entites/User.js";

class UserService {

  async create(user){
    /*if (picture) {
      fileName = FileService.saveFile(picture);
    }*/
    const  createdUser = await User.create({...user, status: false})
    return createdUser;
  }

  async getAll() {
    const users = await User.find().populate('company');
    return users;
  }

  async getOne(id) {
    if (!id) {
      throw new Error('id не указан ');
    }
    const user = await User.findById(id)
      .populate('company')
    return user;
  }

  async update(user) {
    if (!user._id) {
      throw new Error('id не указан ');
    }
    const updatedUser = await User.findByIdAndUpdate(user._id, user);
    return updatedUser;
  }

  async delete(id) {
    if (!id) {
      throw new Error('id не указан ');
    }
    const user = await User.findByIdAndDelete(id);
    return user;
  }

}

export default new UserService();