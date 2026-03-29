const jwt = require('jsonwebtoken');

// Simple blacklist in-memory store for now.
// For production, use Redis.
const blacklistedTokens = new Set();

class TokenService {
  generateAccessToken(userId, role) {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
  }

  generateRefreshToken(userId, role) {
    return jwt.sign({ id: userId, role }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE
    });
  }

  verifyAccessToken(token) {
    if (blacklistedTokens.has(token)) throw new Error('Token is blacklisted');
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  verifyRefreshToken(token) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  }

  blacklistToken(token) {
    blacklistedTokens.add(token);
    return true;
  }
}

module.exports = new TokenService();
