const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '86400';

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      username: user.username,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: parseInt(JWT_EXPIRATION) }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};