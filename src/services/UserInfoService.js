import UserInfoSchema from "../entites/UserInfoSchema.js";

class UserInfoService {
  async add(info) {
    const userInfo = await UserInfoSchema.create(info);
    return userInfo;
  }
}

export default new UserInfoService();