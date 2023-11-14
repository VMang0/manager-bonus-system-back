import jwt from 'jsonwebtoken';
import tokenSchema from "../entites/TokenSchema.js";
import TokenSchema from "../entites/TokenSchema.js";
import dotenv from 'dotenv';
dotenv.config();

class TokenService {
  generateToken(payload) {
    try {
      const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15s'});
      const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
      return {
        accessToken,
        refreshToken
      }
    } catch (e) {
      console.log(e);
    }
  }
  async saveToken(userId, refreshToken) {
    const tokenData = await tokenSchema.findOne({user: userId});
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await tokenSchema.create({user: userId, refreshToken});
    return token;
  }
  async removeToken(refreshToken) {
    const tokenData = await TokenSchema.deleteOne({ refreshToken });
    return tokenData;
  }
  validationAccessToken(accessToken) {
    try {
      const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
      return userData;
    } catch (e) {
      return null;
    }
  }
  validationRefreshToken(refreshToken) {
    try {
      const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
      return userData;
    } catch (e) {
      return null;
    }
  }
  async findToken(refreshToken) {
    const tokenData = await tokenSchema.findOne({refreshToken: refreshToken})
    return tokenData;
  }
}

export default new TokenService();