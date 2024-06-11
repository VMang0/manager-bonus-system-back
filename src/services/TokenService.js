import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

class TokenService {
  generateToken(payload) {
    try {
      return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '1d'});
    } catch (e) {
      console.log(e);
    }
  }

  validationAccessToken(accessToken) {
    try {
      const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
      return userData;
    } catch (e) {
      return null;
    }
  }
}

export default new TokenService();