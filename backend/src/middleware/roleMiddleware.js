const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.' 
      });
    }
    next();
  };
};


const isAdmin = checkRole(['Admin']);
const isManager = checkRole(['Manager', 'Admin']);
const isEmployee = checkRole(['Employee', 'Manager', 'Admin']);

module.exports = {
  checkRole,
  isAdmin,
  isManager,
  isEmployee
};