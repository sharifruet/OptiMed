const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { executeQuery } = require('../config/database');
const { protect } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
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
    
    // Get primary role
    const primaryRole = roles.find(role => role.is_primary) || roles[0];
    
    // Remove password from response
    delete user.password_hash;
    
    res.json({
      success: true,
      data: {
        ...user,
        roles,
        permissions,
        functions,
        primaryRole: primaryRole?.role_name
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

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
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

    const { full_name, email, phone, password, role_ids } = req.body;

    // Check if user already exists
    const existingUsers = await executeQuery(
      'SELECT user_id FROM users WHERE email = ? OR phone = ?',
      [email, phone]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or phone already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const result = await executeQuery(
      'INSERT INTO users (full_name, email, phone, password_hash) VALUES (?, ?, ?, ?)',
      [full_name, email, phone, hashedPassword]
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
      'SELECT user_id, full_name, email, phone, status FROM users WHERE user_id = ?',
      [userId]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser[0].user_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser[0],
        token
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if user exists
    const users = await executeQuery(
      `SELECT u.user_id, u.full_name, u.email, u.phone, u.password_hash, 
              u.status, u.language_preference
       FROM users u 
       WHERE u.email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
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

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await executeQuery(
      'UPDATE users SET last_login = NOW() WHERE user_id = ?',
      [user.user_id]
    );

    // Get user roles
    const roles = await executeQuery(
      `SELECT r.role_id, r.role_name, r.description, ur.is_primary
       FROM roles r
       JOIN user_roles ur ON r.role_id = ur.role_id
       WHERE ur.user_id = ? AND r.is_active = TRUE
       ORDER BY ur.is_primary DESC, r.role_name`,
      [user.user_id]
    );

    // Get user permissions
    const permissions = await executeQuery(
      `SELECT DISTINCT p.permission_key, p.permission_name, p.module, p.category
       FROM permissions p
       JOIN role_permissions rp ON p.permission_id = rp.permission_id
       JOIN user_roles ur ON rp.role_id = ur.role_id
       WHERE ur.user_id = ? AND p.is_active = TRUE
       ORDER BY p.module, p.category, p.permission_name`,
      [user.user_id]
    );

    // Get user functions
    const functions = await executeQuery(
      `SELECT DISTINCT f.function_key, f.function_name, f.module, f.route
       FROM functions f
       JOIN role_functions rf ON f.function_id = rf.function_id
       JOIN user_roles ur ON rf.role_id = ur.role_id
       WHERE ur.user_id = ? AND f.is_active = TRUE
       ORDER BY f.module, f.function_name`,
      [user.user_id]
    );

    // Get primary role
    const primaryRole = roles.find(role => role.is_primary) || roles[0];

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.user_id,
        roles: roles.map(r => r.role_name),
        permissions: permissions.map(p => p.permission_key)
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    // Remove password from response
    delete user.password_hash;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          ...user,
          roles,
          permissions,
          functions,
          primaryRole: primaryRole?.role_name
        },
        token
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const users = await executeQuery(
      `SELECT u.user_id, u.full_name, u.email, u.phone, u.role_id, 
              u.status, u.language_preference, u.last_login, r.role_name
       FROM users u 
       JOIN roles r ON u.role_id = r.role_id 
       WHERE u.user_id = ?`,
      [req.user.user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    logger.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', [
  protect,
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get current user with password
    const users = await executeQuery(
      'SELECT password_hash FROM users WHERE user_id = ?',
      [req.user.user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, users[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await executeQuery(
      'UPDATE users SET password_hash = ? WHERE user_id = ?',
      [hashedPassword, req.user.user_id]
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

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router; 