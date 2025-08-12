const express = require('express');
const { body, validationResult } = require('express-validator');
const { executeQuery } = require('../config/database');
const { protect, authorize } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, u.email, u.phone as user_phone 
      FROM patients p 
      LEFT JOIN users u ON p.user_id = u.user_id 
      WHERE 1=1
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM patients p WHERE 1=1';
    let params = [];
    let countParams = [];

    if (search) {
      query += ' AND (p.full_name LIKE ? OR p.patient_code LIKE ? OR p.nid_number LIKE ?)';
      countQuery += ' AND (p.full_name LIKE ? OR p.patient_code LIKE ? OR p.nid_number LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
      countParams.push(searchParam, searchParam, searchParam);
    }

    if (status) {
      query += ' AND p.status = ?';
      countQuery += ' AND p.status = ?';
      params.push(status);
      countParams.push(status);
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [patients] = await executeQuery(query, params);
    const [countResult] = await executeQuery(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: patients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const [patients] = await executeQuery(
      `SELECT p.*, u.email, u.phone as user_phone 
       FROM patients p 
       LEFT JOIN users u ON p.user_id = u.user_id 
       WHERE p.patient_id = ?`,
      [id]
    );

    if (patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: patients[0]
    });
  } catch (error) {
    logger.error('Get patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create patient
// @route   POST /api/patients
// @access  Private
router.post('/', [
  protect,
  authorize('Admin', 'Receptionist', 'Doctor'),
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('patient_code').notEmpty().withMessage('Patient code is required'),
  body('phone').notEmpty().withMessage('Phone number is required')
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
      patient_code,
      nid_number,
      passport_number,
      dob,
      gender,
      blood_group,
      phone,
      address_line1,
      division,
      district,
      upazila
    } = req.body;

    // Check if patient code already exists
    const [existingPatients] = await executeQuery(
      'SELECT patient_id FROM patients WHERE patient_code = ?',
      [patient_code]
    );

    if (existingPatients.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Patient code already exists'
      });
    }

    // Create patient
    const [result] = await executeQuery(
      `INSERT INTO patients (
        full_name, patient_code, nid_number, passport_number, dob, gender, 
        blood_group, phone, address_line1, division, district, upazila
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [full_name, patient_code, nid_number, passport_number, dob, gender, 
       blood_group, phone, address_line1, division, district, upazila]
    );

    // Get created patient
    const [newPatient] = await executeQuery(
      'SELECT * FROM patients WHERE patient_id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: newPatient[0]
    });
  } catch (error) {
    logger.error('Create patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
router.put('/:id', [
  protect,
  authorize('Admin', 'Receptionist', 'Doctor')
], async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if patient exists
    const [existingPatients] = await executeQuery(
      'SELECT patient_id FROM patients WHERE patient_id = ?',
      [id]
    );

    if (existingPatients.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Build update query dynamically
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    
    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const query = `UPDATE patients SET ${setClause}, updated_at = NOW() WHERE patient_id = ?`;
    
    await executeQuery(query, [...values, id]);

    // Get updated patient
    const [updatedPatient] = await executeQuery(
      'SELECT * FROM patients WHERE patient_id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: updatedPatient[0]
    });
  } catch (error) {
    logger.error('Update patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private
router.delete('/:id', [
  protect,
  authorize('Admin')
], async (req, res) => {
  try {
    const { id } = req.params;

    // Check if patient exists
    const [existingPatients] = await executeQuery(
      'SELECT patient_id FROM patients WHERE patient_id = ?',
      [id]
    );

    if (existingPatients.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Soft delete - update status to inactive
    await executeQuery(
      'UPDATE patients SET status = "Inactive", updated_at = NOW() WHERE patient_id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    logger.error('Delete patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 