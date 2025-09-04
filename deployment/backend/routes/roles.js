const express = require('express');
const { body, validationResult } = require('express-validator');
const { executeQuery } = require('../config/database');
const { protect } = require('../middleware/auth');
const RBACMiddleware = require('../middleware/rbac');
const logger = require('../utils/logger');

const router = express.Router();

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private (Admin only)
router.get('/', protect, RBACMiddleware.hasPermission('role.read'), async (req, res) => {
  try {
    const query = `
      SELECT r.*, 
             COUNT(DISTINCT ur.user_id) as user_count,
             COUNT(DISTINCT rp.permission_id) as permission_count,
             COUNT(DISTINCT rf.function_id) as function_count
      FROM roles r
      LEFT JOIN user_roles ur ON r.role_id = ur.role_id
      LEFT JOIN role_permissions rp ON r.role_id = rp.role_id
      LEFT JOIN role_functions rf ON r.role_id = rf.role_id
      WHERE r.is_active = TRUE
      GROUP BY r.role_id
      ORDER BY r.role_name
    `;
    
    const roles = await executeQuery(query);
    
    res.json({
      success: true,
      data: roles
    });
  } catch (error) {
    logger.error('Get roles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single role with details
// @route   GET /api/roles/:id
// @access  Private (Admin only)
router.get('/:id', protect, RBACMiddleware.hasPermission('role.read'), async (req, res) => {
  try {
    const roleId = parseInt(req.params.id);
    
    // Get role details
    const roleQuery = 'SELECT * FROM roles WHERE role_id = ? AND is_active = TRUE';
    const roles = await executeQuery(roleQuery, [roleId]);
    
    if (roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    const role = roles[0];
    
    // Get role permissions
    const permissionsQuery = `
      SELECT p.*
      FROM permissions p
      JOIN role_permissions rp ON p.permission_id = rp.permission_id
      WHERE rp.role_id = ? AND p.is_active = TRUE
      ORDER BY p.module, p.category, p.permission_name
    `;
    const permissions = await executeQuery(permissionsQuery, [roleId]);
    
    // Get role functions
    const functionsQuery = `
      SELECT f.*
      FROM functions f
      JOIN role_functions rf ON f.function_id = rf.function_id
      WHERE rf.role_id = ? AND f.is_active = TRUE
      ORDER BY f.module, f.function_name
    `;
    const functions = await executeQuery(functionsQuery, [roleId]);
    
    // Get users with this role
    const usersQuery = `
      SELECT u.user_id, u.full_name, u.email, ur.is_primary
      FROM users u
      JOIN user_roles ur ON u.user_id = ur.user_id
      WHERE ur.role_id = ? AND u.status = 'ACTIVE'
      ORDER BY ur.is_primary DESC, u.full_name
    `;
    const users = await executeQuery(usersQuery, [roleId]);
    
    res.json({
      success: true,
      data: {
        ...role,
        permissions,
        functions,
        users
      }
    });
  } catch (error) {
    logger.error('Get role details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new role
// @route   POST /api/roles
// @access  Private (Admin only)
router.post('/', [
  protect,
  RBACMiddleware.hasPermission('role.create'),
  body('role_name').notEmpty().withMessage('Role name is required'),
  body('description').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { role_name, description } = req.body;

    // Check if role already exists
    const existingRoles = await executeQuery(
      'SELECT role_id FROM roles WHERE role_name = ?',
      [role_name]
    );

    if (existingRoles.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Role with this name already exists'
      });
    }

    // Create role
    const result = await executeQuery(
      'INSERT INTO roles (role_name, description) VALUES (?, ?)',
      [role_name, description]
    );

    const newRole = await executeQuery(
      'SELECT * FROM roles WHERE role_id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: newRole[0]
    });
  } catch (error) {
    logger.error('Create role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update role
// @route   PUT /api/roles/:id
// @access  Private (Admin only)
router.put('/:id', [
  protect,
  RBACMiddleware.hasPermission('role.update'),
  body('role_name').optional(),
  body('description').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const roleId = parseInt(req.params.id);
    const { role_name, description } = req.body;

    // Check if role exists
    const existingRoles = await executeQuery(
      'SELECT role_id FROM roles WHERE role_id = ? AND is_active = TRUE',
      [roleId]
    );

    if (existingRoles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Check if new name conflicts with existing role
    if (role_name) {
      const nameConflict = await executeQuery(
        'SELECT role_id FROM roles WHERE role_name = ? AND role_id != ?',
        [role_name, roleId]
      );

      if (nameConflict.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Role with this name already exists'
        });
      }
    }

    // Update role
    const updateFields = [];
    const updateValues = [];

    if (role_name) {
      updateFields.push('role_name = ?');
      updateValues.push(role_name);
    }

    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateValues.push(roleId);
    await executeQuery(
      `UPDATE roles SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE role_id = ?`,
      updateValues
    );

    const updatedRole = await executeQuery(
      'SELECT * FROM roles WHERE role_id = ?',
      [roleId]
    );

    res.json({
      success: true,
      message: 'Role updated successfully',
      data: updatedRole[0]
    });
  } catch (error) {
    logger.error('Update role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete role
// @route   DELETE /api/roles/:id
// @access  Private (Admin only)
router.delete('/:id', protect, RBACMiddleware.hasPermission('role.delete'), async (req, res) => {
  try {
    const roleId = parseInt(req.params.id);

    // Check if role exists
    const existingRoles = await executeQuery(
      'SELECT role_name FROM roles WHERE role_id = ? AND is_active = TRUE',
      [roleId]
    );

    if (existingRoles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Check if role is assigned to any users
    const userRoles = await executeQuery(
      'SELECT COUNT(*) as count FROM user_roles WHERE role_id = ?',
      [roleId]
    );

    if (userRoles[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete role that is assigned to users'
      });
    }

    // Soft delete role
    await executeQuery(
      'UPDATE roles SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE role_id = ?',
      [roleId]
    );

    res.json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    logger.error('Delete role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Assign permissions to role
// @route   POST /api/roles/:id/permissions
// @access  Private (Admin only)
router.post('/:id/permissions', [
  protect,
  RBACMiddleware.hasPermission('role.permissions'),
  body('permission_ids').isArray().withMessage('Permission IDs must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const roleId = parseInt(req.params.id);
    const { permission_ids } = req.body;
    const grantedBy = req.user.user_id;

    // Check if role exists
    const existingRoles = await executeQuery(
      'SELECT role_id FROM roles WHERE role_id = ? AND is_active = TRUE',
      [roleId]
    );

    if (existingRoles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Remove existing permissions
    await executeQuery(
      'DELETE FROM role_permissions WHERE role_id = ?',
      [roleId]
    );

    // Assign new permissions
    if (permission_ids.length > 0) {
      const values = permission_ids.map(permissionId => [roleId, permissionId, grantedBy]);
      const placeholders = values.map(() => '(?, ?, ?)').join(',');
      
      await executeQuery(
        `INSERT INTO role_permissions (role_id, permission_id, granted_by) VALUES ${placeholders}`,
        values.flat()
      );
    }

    res.json({
      success: true,
      message: 'Permissions assigned successfully'
    });
  } catch (error) {
    logger.error('Assign permissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Assign functions to role
// @route   POST /api/roles/:id/functions
// @access  Private (Admin only)
router.post('/:id/functions', [
  protect,
  RBACMiddleware.hasPermission('role.permissions'),
  body('function_ids').isArray().withMessage('Function IDs must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const roleId = parseInt(req.params.id);
    const { function_ids } = req.body;
    const grantedBy = req.user.user_id;

    // Check if role exists
    const existingRoles = await executeQuery(
      'SELECT role_id FROM roles WHERE role_id = ? AND is_active = TRUE',
      [roleId]
    );

    if (existingRoles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Remove existing functions
    await executeQuery(
      'DELETE FROM role_functions WHERE role_id = ?',
      [roleId]
    );

    // Assign new functions
    if (function_ids.length > 0) {
      const values = function_ids.map(functionId => [roleId, functionId, grantedBy]);
      const placeholders = values.map(() => '(?, ?, ?)').join(',');
      
      await executeQuery(
        `INSERT INTO role_functions (role_id, function_id, granted_by) VALUES ${placeholders}`,
        values.flat()
      );
    }

    res.json({
      success: true,
      message: 'Functions assigned successfully'
    });
  } catch (error) {
    logger.error('Assign functions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all permissions
// @route   GET /api/roles/permissions/list
// @access  Private (Admin only)
router.get('/permissions/list', protect, RBACMiddleware.hasPermission('role.read'), async (req, res) => {
  try {
    const query = `
      SELECT * FROM permissions 
      WHERE is_active = TRUE 
      ORDER BY module, category, permission_name
    `;
    
    const permissions = await executeQuery(query);
    
    res.json({
      success: true,
      data: permissions
    });
  } catch (error) {
    logger.error('Get permissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all functions
// @route   GET /api/roles/functions/list
// @access  Private (Admin only)
router.get('/functions/list', protect, RBACMiddleware.hasPermission('role.read'), async (req, res) => {
  try {
    const query = `
      SELECT * FROM functions 
      WHERE is_active = TRUE 
      ORDER BY module, function_name
    `;
    
    const functions = await executeQuery(query);
    
    res.json({
      success: true,
      data: functions
    });
  } catch (error) {
    logger.error('Get functions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
