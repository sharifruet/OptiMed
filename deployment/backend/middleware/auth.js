const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');
const logger = require('../utils/logger');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database
      const users = await executeQuery(
        'SELECT user_id, full_name, email, status FROM users WHERE user_id = ?',
        [decoded.userId]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      const user = users[0];

      // Check if user is active
      if (user.status !== 'ACTIVE') {
        return res.status(401).json({
          success: false,
          message: 'User account is not active'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      logger.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Authorize roles (updated for multiple roles)
const authorize = (...roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Get user roles
      const roleData = await executeQuery(
        `SELECT r.role_name 
         FROM roles r 
         JOIN user_roles ur ON r.role_id = ur.role_id 
         WHERE ur.user_id = ? AND r.is_active = TRUE`,
        [req.user.user_id]
      );

      if (roleData.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'User has no active roles'
        });
      }

      const userRoles = roleData.map(r => r.role_name);
      const hasAuthorizedRole = userRoles.some(role => roles.includes(role));

      if (!hasAuthorizedRole) {
        return res.status(403).json({
          success: false,
          message: `User roles '${userRoles.join(', ')}' are not authorized to access this route`
        });
      }

      next();
    } catch (error) {
      logger.error('Role authorization error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking user authorization'
      });
    }
  };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const users = await executeQuery(
        'SELECT user_id, full_name, email, role_id, status FROM users WHERE user_id = ?',
        [decoded.userId]
      );

      if (users.length > 0 && users[0].status === 'ACTIVE') {
        req.user = users[0];
      }
    } catch (error) {
      // Token is invalid, but we don't fail the request
      logger.warn('Invalid token in optional auth:', error.message);
    }
  }

  next();
};

module.exports = {
  protect,
  authorize,
  optionalAuth
}; 