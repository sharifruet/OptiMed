const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { executeQuery } = require('../config/database');
const { protect } = require('../middleware/auth');
const RBACMiddleware = require('../middleware/rbac');
const logger = require('../utils/logger');

const router = express.Router();

// @desc    Get all users with roles
// @route   GET /api/users
// @access  Private (Admin only)
router.get('/', protect, RBACMiddleware.hasPermission('user.read'), async (req, res) => {
  try {
    const query = `
      SELECT u.user_id, u.full_name, u.email, u.phone, u.status, 
             u.language_preference, u.last_login, u.created_at,
             GROUP_CONCAT(DISTINCT r.role_name ORDER BY ur.is_primary DESC, r.role_name SEPARATOR ', ') as roles,
             COUNT(DISTINCT r.role_id) as role_count
      FROM users u
      LEFT JOIN user_roles ur ON u.user_id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.role_id AND r.is_active = TRUE
      GROUP BY u.user_id
      ORDER BY u.created_at DESC
    `;
    
    const users = await executeQuery(query);
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single user with details
// @route   GET /api/users/:id
// @access  Private (Admin or self)
router.get('/:id', protect, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const requestingUserId = req.user.user_id;
    const isAdmin = await RBACMiddleware.isAdmin(requestingUserId);
    
    // Users can only view their own profile unless they're admin
    if (!isAdmin && userId !== requestingUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get user details
    const userQuery = 'SELECT * FROM users WHERE user_id = ?';
    const users = await executeQuery(userQuery, [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const user = users[0];
    
    // Get user roles
    const rolesQuery = `
      SELECT r.role_id, r.role_name, r.description, ur.is_primary
      FROM roles r
      JOIN user_roles ur ON r.role_id = ur.role_id
      WHERE ur.user_id = ? AND r.is_active = TRUE
      ORDER BY ur.is_primary DESC, r.role_name
    `;
    const roles = await executeQuery(rolesQuery, [userId]);
    
    // Get user permissions
    const permissionsQuery = `
      SELECT DISTINCT p.permission_key, p.permission_name, p.module, p.category
      FROM permissions p
      JOIN role_permissions rp ON p.permission_id = rp.permission_id
      JOIN user_roles ur ON rp.role_id = ur.role_id
      WHERE ur.user_id = ? AND p.is_active = TRUE
      ORDER BY p.module, p.category, p.permission_name
    `;
    const permissions = await executeQuery(permissionsQuery, [userId]);
    
    // Get user functions
    const functionsQuery = `
      SELECT DISTINCT f.function_key, f.function_name, f.module, f.route
      FROM functions f
      JOIN role_functions rf ON f.function_id = rf.function_id
      JOIN user_roles ur ON rf.role_id = ur.role_id
      WHERE ur.user_id = ? AND f.is_active = TRUE
      ORDER BY f.module, f.function_name
    `;
    const functions = await executeQuery(functionsQuery, [userId]);
    
    // Remove password from response
    delete user.password_hash;
    
    res.json({
      success: true,
      data: {
        ...user,
        roles,
        permissions,
        functions
      }
    });
  } catch (error) {
    logger.error('Get user details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new user
// @route   POST /api/users
// @access  Private (Admin only)
router.post('/', [
  protect,
  RBACMiddleware.hasPermission('user.create'),
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').optional(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role_ids').isArray().withMessage('Role IDs must be an array'),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
  body('language_preference').optional().isIn(['Bengali', 'English'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { 
      full_name, 
      email, 
      phone, 
      password, 
      role_ids, 
      status = 'ACTIVE',
      language_preference = 'English' 
    } = req.body;

    // Check if email already exists
    const existingUsers = await executeQuery(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Check if phone already exists (if provided)
    if (phone) {
      const existingPhone = await executeQuery(
        'SELECT user_id FROM users WHERE phone = ?',
        [phone]
      );

      if (existingPhone.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'User with this phone number already exists'
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const result = await executeQuery(
      'INSERT INTO users (full_name, email, phone, password_hash, status, language_preference) VALUES (?, ?, ?, ?, ?, ?)',
      [full_name, email, phone, passwordHash, status, language_preference]
    );

    const userId = result.insertId;

    // Assign roles
    if (role_ids && role_ids.length > 0) {
      const roleValues = role_ids.map((roleId, index) => [userId, roleId, index === 0]); // First role is primary
      const placeholders = roleValues.map(() => '(?, ?, ?)').join(',');
      
      await executeQuery(
        `INSERT INTO user_roles (user_id, role_id, is_primary) VALUES ${placeholders}`,
        roleValues.flat()
      );
    }

    // Get created user with roles
    const newUser = await executeQuery(
      'SELECT * FROM users WHERE user_id = ?',
      [userId]
    );

    delete newUser[0].password_hash;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser[0]
    });
  } catch (error) {
    logger.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin or self)
router.put('/:id', [
  protect,
  body('full_name').optional(),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('phone').optional(),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
  body('language_preference').optional().isIn(['Bengali', 'English'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const userId = parseInt(req.params.id);
    const requestingUserId = req.user.user_id;
    const isAdmin = await RBACMiddleware.isAdmin(requestingUserId);
    
    // Users can only update their own profile unless they're admin
    if (!isAdmin && userId !== requestingUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { full_name, email, phone, status, language_preference } = req.body;

    // Check if user exists
    const existingUsers = await executeQuery(
      'SELECT user_id FROM users WHERE user_id = ?',
      [userId]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if new email conflicts with existing user
    if (email) {
      const emailConflict = await executeQuery(
        'SELECT user_id FROM users WHERE email = ? AND user_id != ?',
        [email, userId]
      );

      if (emailConflict.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
    }

    // Check if new phone conflicts with existing user
    if (phone) {
      const phoneConflict = await executeQuery(
        'SELECT user_id FROM users WHERE phone = ? AND user_id != ?',
        [phone, userId]
      );

      if (phoneConflict.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'User with this phone number already exists'
        });
      }
    }

    // Update user
    const updateFields = [];
    const updateValues = [];

    if (full_name) {
      updateFields.push('full_name = ?');
      updateValues.push(full_name);
    }

    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }

    if (phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }

    if (status && isAdmin) { // Only admin can change status
      updateFields.push('status = ?');
      updateValues.push(status);
    }

    if (language_preference) {
      updateFields.push('language_preference = ?');
      updateValues.push(language_preference);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateValues.push(userId);
    await executeQuery(
      `UPDATE users SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
      updateValues
    );

    const updatedUser = await executeQuery(
      'SELECT * FROM users WHERE user_id = ?',
      [userId]
    );

    delete updatedUser[0].password_hash;

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser[0]
    });
  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Change user password
// @route   PUT /api/users/:id/password
// @access  Private (Admin or self)
router.put('/:id/password', [
  protect,
  body('current_password').notEmpty().withMessage('Current password is required'),
  body('new_password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const userId = parseInt(req.params.id);
    const requestingUserId = req.user.user_id;
    const isAdmin = await RBACMiddleware.isAdmin(requestingUserId);
    
    // Users can only change their own password unless they're admin
    if (!isAdmin && userId !== requestingUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { current_password, new_password } = req.body;

    // Get user's current password
    const users = await executeQuery(
      'SELECT password_hash FROM users WHERE user_id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password (skip for admin)
    if (!isAdmin) {
      const isMatch = await bcrypt.compare(current_password, users[0].password_hash);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(new_password, salt);

    // Update password
    await executeQuery(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [passwordHash, userId]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Assign roles to user
// @route   POST /api/users/:id/roles
// @access  Private (Admin only)
router.post('/:id/roles', [
  protect,
  RBACMiddleware.hasPermission('user.update'),
  body('role_ids').isArray().withMessage('Role IDs must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const userId = parseInt(req.params.id);
    const { role_ids } = req.body;
    const assignedBy = req.user.user_id;

    // Check if user exists
    const existingUsers = await executeQuery(
      'SELECT user_id FROM users WHERE user_id = ?',
      [userId]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove existing roles
    await executeQuery(
      'DELETE FROM user_roles WHERE user_id = ?',
      [userId]
    );

    // Assign new roles
    if (role_ids && role_ids.length > 0) {
      const roleValues = role_ids.map((roleId, index) => [userId, roleId, index === 0]); // First role is primary
      const placeholders = roleValues.map(() => '(?, ?, ?)').join(',');
      
      await executeQuery(
        `INSERT INTO user_roles (user_id, role_id, is_primary) VALUES ${placeholders}`,
        roleValues.flat()
      );
    }

    res.json({
      success: true,
      message: 'Roles assigned successfully'
    });
  } catch (error) {
    logger.error('Assign roles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
router.delete('/:id', protect, RBACMiddleware.hasPermission('user.delete'), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Check if user exists
    const existingUsers = await executeQuery(
      'SELECT user_id FROM users WHERE user_id = ?',
      [userId]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete user
    await executeQuery(
      'UPDATE users SET status = "INACTIVE", updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get current user profile
// @route   GET /api/users/profile/me
// @access  Private
router.get('/profile/me', protect, async (req, res) => {
  try {
    const userId = req.user.user_id;

    // Get user details
    const userQuery = 'SELECT * FROM users WHERE user_id = ?';
    const users = await executeQuery(userQuery, [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const user = users[0];
    
    // Get user roles
    const rolesQuery = `
      SELECT r.role_id, r.role_name, r.description, ur.is_primary
      FROM roles r
      JOIN user_roles ur ON r.role_id = ur.role_id
      WHERE ur.user_id = ? AND r.is_active = TRUE
      ORDER BY ur.is_primary DESC, r.role_name
    `;
    const roles = await executeQuery(rolesQuery, [userId]);
    
    // Get user permissions
    const permissionsQuery = `
      SELECT DISTINCT p.permission_key, p.permission_name, p.module, p.category
      FROM permissions p
      JOIN role_permissions rp ON p.permission_id = rp.permission_id
      JOIN user_roles ur ON rp.role_id = ur.role_id
      WHERE ur.user_id = ? AND p.is_active = TRUE
      ORDER BY p.module, p.category, p.permission_name
    `;
    const permissions = await executeQuery(permissionsQuery, [userId]);
    
    // Get user functions
    const functionsQuery = `
      SELECT DISTINCT f.function_key, f.function_name, f.module, f.route
      FROM functions f
      JOIN role_functions rf ON f.function_id = rf.function_id
      JOIN user_roles ur ON rf.role_id = ur.role_id
      WHERE ur.user_id = ? AND f.is_active = TRUE
      ORDER BY f.module, f.function_name
    `;
    const functions = await executeQuery(functionsQuery, [userId]);
    
    // Remove password from response
    delete user.password_hash;
    
    res.json({
      success: true,
      data: {
        ...user,
        roles,
        permissions,
        functions
      }
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
