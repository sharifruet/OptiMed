const { executeQuery } = require('../config/database');
const logger = require('../utils/logger');

/**
 * RBAC Middleware for checking permissions
 */
class RBACMiddleware {
  /**
   * Check if user has specific permission
   */
  static hasPermission(permissionKey) {
    return async (req, res, next) => {
      try {
        const userId = req.user?.user_id;
        
        if (!userId) {
          return res.status(401).json({
            success: false,
            message: 'Authentication required'
          });
        }

        const hasPermission = await this.checkUserPermission(userId, permissionKey);
        
        if (!hasPermission) {
          return res.status(403).json({
            success: false,
            message: 'Insufficient permissions'
          });
        }

        next();
      } catch (error) {
        logger.error('Permission check error:', error);
        return res.status(500).json({
          success: false,
          message: 'Permission check failed'
        });
      }
    };
  }

  /**
   * Check if user has specific function access
   */
  static hasFunction(functionKey) {
    return async (req, res, next) => {
      try {
        const userId = req.user?.user_id;
        if (!userId) {
          return res.status(401).json({
            success: false,
            message: 'Authentication required'
          });
        }

        const hasFunction = await this.checkUserFunction(userId, functionKey);
        
        if (!hasFunction) {
          return res.status(403).json({
            success: false,
            message: 'Function access denied'
          });
        }

        next();
      } catch (error) {
        logger.error('Function check error:', error);
        return res.status(500).json({
          success: false,
          message: 'Function check failed'
        });
      }
    };
  }

  /**
   * Check if user has any of the specified permissions
   */
  static hasAnyPermission(permissionKeys) {
    return async (req, res, next) => {
      try {
        const userId = req.user?.user_id;
        if (!userId) {
          return res.status(401).json({
            success: false,
            message: 'Authentication required'
          });
        }

        const hasAnyPermission = await this.checkUserAnyPermission(userId, permissionKeys);
        
        if (!hasAnyPermission) {
          return res.status(403).json({
            success: false,
            message: 'Insufficient permissions'
          });
        }

        next();
      } catch (error) {
        logger.error('Permission check error:', error);
        return res.status(500).json({
          success: false,
          message: 'Permission check failed'
        });
      }
    };
  }

  /**
   * Check if user has all specified permissions
   */
  static hasAllPermissions(permissionKeys) {
    return async (req, res, next) => {
      try {
        const userId = req.user?.user_id;
        if (!userId) {
          return res.status(401).json({
            success: false,
            message: 'Authentication required'
          });
        }

        const hasAllPermissions = await this.checkUserAllPermissions(userId, permissionKeys);
        
        if (!hasAllPermissions) {
          return res.status(403).json({
            success: false,
            message: 'Insufficient permissions'
          });
        }

        next();
      } catch (error) {
        logger.error('Permission check error:', error);
        return res.status(500).json({
          success: false,
          message: 'Permission check failed'
        });
      }
    };
  }

  /**
   * Check if user has permission for specific module
   */
  static hasModuleAccess(module, action = 'read') {
    return async (req, res, next) => {
      try {
        const userId = req.user?.user_id;
        if (!userId) {
          return res.status(401).json({
            success: false,
            message: 'Authentication required'
          });
        }

        const permissionKey = `${module}.${action}`;
        const hasPermission = await this.checkUserPermission(userId, permissionKey);
        
        if (!hasPermission) {
          return res.status(403).json({
            success: false,
            message: `Access denied for ${module} ${action}`
          });
        }

        next();
      } catch (error) {
        logger.error('Module access check error:', error);
        return res.status(500).json({
          success: false,
          message: 'Access check failed'
        });
      }
    };
  }

  /**
   * Get user permissions
   */
  static async getUserPermissions(userId) {
    try {
      const query = `
        SELECT DISTINCT p.permission_key, p.permission_name, p.module, p.category
        FROM permissions p
        JOIN role_permissions rp ON p.permission_id = rp.permission_id
        JOIN user_roles ur ON rp.role_id = ur.role_id
        WHERE ur.user_id = ? AND p.is_active = TRUE
        ORDER BY p.module, p.category, p.permission_name
      `;
      
      const permissions = await executeQuery(query, [userId]);
      return permissions;
    } catch (error) {
      logger.error('Get user permissions error:', error);
      return [];
    }
  }

  /**
   * Get user functions
   */
  static async getUserFunctions(userId) {
    try {
      const query = `
        SELECT DISTINCT f.function_key, f.function_name, f.module, f.route
        FROM functions f
        JOIN role_functions rf ON f.function_id = rf.function_id
        JOIN user_roles ur ON rf.role_id = ur.role_id
        WHERE ur.user_id = ? AND f.is_active = TRUE
        ORDER BY f.module, f.function_name
      `;
      
      const functions = await executeQuery(query, [userId]);
      return functions;
    } catch (error) {
      logger.error('Get user functions error:', error);
      return [];
    }
  }

  /**
   * Get user roles
   */
  static async getUserRoles(userId) {
    try {
      const query = `
        SELECT r.role_id, r.role_name, r.description, ur.is_primary
        FROM roles r
        JOIN user_roles ur ON r.role_id = ur.role_id
        WHERE ur.user_id = ? AND r.is_active = TRUE
        ORDER BY ur.is_primary DESC, r.role_name
      `;
      
      const roles = await executeQuery(query, [userId]);
      return roles;
    } catch (error) {
      logger.error('Get user roles error:', error);
      return [];
    }
  }

  /**
   * Check if user has specific permission
   */
  static async checkUserPermission(userId, permissionKey) {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM permissions p
        JOIN role_permissions rp ON p.permission_id = rp.permission_id
        JOIN user_roles ur ON rp.role_id = ur.role_id
        WHERE ur.user_id = ? AND p.permission_key = ? AND p.is_active = TRUE
      `;
      
      const result = await executeQuery(query, [userId, permissionKey]);
      return result[0]?.count > 0;
    } catch (error) {
      logger.error('Check user permission error:', error);
      return false;
    }
  }

  /**
   * Check if user has specific function
   */
  static async checkUserFunction(userId, functionKey) {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM functions f
        JOIN role_functions rf ON f.function_id = rf.function_id
        JOIN user_roles ur ON rf.role_id = ur.role_id
        WHERE ur.user_id = ? AND f.function_key = ? AND f.is_active = TRUE
      `;
      
      const result = await executeQuery(query, [userId, functionKey]);
      return result[0]?.count > 0;
    } catch (error) {
      logger.error('Check user function error:', error);
      return false;
    }
  }

  /**
   * Check if user has any of the specified permissions
   */
  static async checkUserAnyPermission(userId, permissionKeys) {
    try {
      const placeholders = permissionKeys.map(() => '?').join(',');
      const query = `
        SELECT COUNT(*) as count
        FROM permissions p
        JOIN role_permissions rp ON p.permission_id = rp.permission_id
        JOIN user_roles ur ON rp.role_id = ur.role_id
        WHERE ur.user_id = ? AND p.permission_key IN (${placeholders}) AND p.is_active = TRUE
      `;
      
      const result = await executeQuery(query, [userId, ...permissionKeys]);
      return result[0]?.count > 0;
    } catch (error) {
      logger.error('Check user any permission error:', error);
      return false;
    }
  }

  /**
   * Check if user has all specified permissions
   */
  static async checkUserAllPermissions(userId, permissionKeys) {
    try {
      const placeholders = permissionKeys.map(() => '?').join(',');
      const query = `
        SELECT COUNT(DISTINCT p.permission_key) as count
        FROM permissions p
        JOIN role_permissions rp ON p.permission_id = rp.permission_id
        JOIN user_roles ur ON rp.role_id = ur.role_id
        WHERE ur.user_id = ? AND p.permission_key IN (${placeholders}) AND p.is_active = TRUE
      `;
      
      const result = await executeQuery(query, [userId, ...permissionKeys]);
      return result[0]?.count === permissionKeys.length;
    } catch (error) {
      logger.error('Check user all permissions error:', error);
      return false;
    }
  }

  /**
   * Check if user is admin
   */
  static async isAdmin(userId) {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM user_roles ur
        JOIN roles r ON ur.role_id = r.role_id
        WHERE ur.user_id = ? AND r.role_name IN ('Super Admin', 'Hospital Admin')
      `;
      
      const result = await executeQuery(query, [userId]);
      return result[0]?.count > 0;
    } catch (error) {
      logger.error('Check admin error:', error);
      return false;
    }
  }

  /**
   * Get user's primary role
   */
  static async getPrimaryRole(userId) {
    try {
      const query = `
        SELECT r.role_name
        FROM roles r
        JOIN user_roles ur ON r.role_id = ur.role_id
        WHERE ur.user_id = ? AND ur.is_primary = TRUE AND r.is_active = TRUE
        LIMIT 1
      `;
      
      const result = await executeQuery(query, [userId]);
      return result[0]?.role_name || null;
    } catch (error) {
      logger.error('Get primary role error:', error);
      return null;
    }
  }
}

module.exports = RBACMiddleware;
