const { verifyToken } = require('../services/jwtService');


const authenticateToken = (req, res, next) => {
  // Get the auth header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
  
  req.user = decoded;
  next();
};

module.exports = {
  authenticateToken
};