const jwt = require('jsonwebtoken');
const { getConfig } = require('../config/environment');

class TokenService {
  generateAccessToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        role: user.role 
      }, 
      getConfig().jwt.secret, 
      { 
        expiresIn: getConfig().jwt.expiration 
      }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      { 
        id: user.id 
      }, 
      process.env.REFRESH_TOKEN_SECRET, 
      { 
        expiresIn: '30d' 
      }
    );
  }

  verifyToken(token, isRefresh = false) {
    const secret = isRefresh 
      ? process.env.REFRESH_TOKEN_SECRET 
      : getConfig().jwt.secret;
    
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
  }
}

module.exports = new TokenService();