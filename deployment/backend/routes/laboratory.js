const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Mock laboratory data (in a real app, this would come from a database)
let labTests = [
  {
    id: 1,
    patientName: 'Ahmed Rahman',
    patientId: 'P001',
    testType: 'Blood Test - Complete',
    doctorName: 'Dr. Sarah Johnson',
    priority: 'High',
    status: 'In Progress',
    requestedDate: '2024-01-20',
    completedDate: null,
    technician: 'Lab Tech 1',
    results: null,
    notes: 'Fasting required'
  },
  {
    id: 2,
    patientName: 'Fatima Begum',
    patientId: 'P002',
    testType: 'Urine Analysis',
    doctorName: 'Dr. Michael Chen',
    priority: 'Normal',
    status: 'Completed',
    requestedDate: '2024-01-19',
    completedDate: '2024-01-20',
    technician: 'Lab Tech 2',
    results: 'Normal',
    notes: 'Sample collected'
  },
  {
    id: 3,
    patientName: 'Mohammad Ali',
    patientId: 'P003',
    testType: 'X-Ray - Chest',
    doctorName: 'Dr. Emily Davis',
    priority: 'Emergency',
    status: 'Completed',
    requestedDate: '2024-01-18',
    completedDate: '2024-01-18',
    technician: 'Lab Tech 3',
    results: 'Clear',
    notes: 'Emergency case'
  },
  {
    id: 4,
    patientName: 'Aisha Khan',
    patientId: 'P004',
    testType: 'ECG',
    doctorName: 'Dr. Robert Wilson',
    priority: 'Normal',
    status: 'Pending',
    requestedDate: '2024-01-21',
    completedDate: null,
    technician: null,
    results: null,
    notes: 'Scheduled for tomorrow'
  }
];

// @desc    Get all lab tests
// @route   GET /api/laboratory
// @access  Private
router.get('/', protect, (req, res) => {
  try {
    res.json({
      success: true,
      data: labTests,
      count: labTests.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Create new lab test
// @route   POST /api/laboratory
// @access  Private
router.post('/', protect, (req, res) => {
  try {
    const { patientName, patientId, testType, doctorName, priority, notes } = req.body;

    // Basic validation
    if (!patientName || !patientId || !testType || !doctorName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const newTest = {
      id: labTests.length + 1,
      patientName,
      patientId,
      testType,
      doctorName,
      priority: priority || 'Normal',
      status: 'Pending',
      requestedDate: new Date().toISOString().split('T')[0],
      completedDate: null,
      technician: null,
      results: null,
      notes: notes || ''
    };

    labTests.push(newTest);

    res.status(201).json({
      success: true,
      data: newTest,
      message: 'Lab test created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Update lab test status
// @route   PUT /api/laboratory/:id
// @access  Private
router.put('/:id', protect, (req, res) => {
  try {
    const { status, results, technician } = req.body;
    const testId = parseInt(req.params.id);

    const testIndex = labTests.findIndex(test => test.id === testId);
    
    if (testIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Lab test not found'
      });
    }

    // Update the test
    if (status) labTests[testIndex].status = status;
    if (results) labTests[testIndex].results = results;
    if (technician) labTests[testIndex].technician = technician;
    
    if (status === 'Completed') {
      labTests[testIndex].completedDate = new Date().toISOString().split('T')[0];
    }

    res.json({
      success: true,
      data: labTests[testIndex],
      message: 'Lab test updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get lab test by ID
// @route   GET /api/laboratory/:id
// @access  Private
router.get('/:id', protect, (req, res) => {
  try {
    const test = labTests.find(t => t.id === parseInt(req.params.id));
    
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Lab test not found'
      });
    }

    res.json({
      success: true,
      data: test
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get test types
// @route   GET /api/laboratory/test-types
// @access  Private
router.get('/test-types', protect, (req, res) => {
  try {
    const testTypes = [
      'Blood Test - Complete',
      'Blood Test - Basic',
      'Urine Analysis',
      'X-Ray - Chest',
      'X-Ray - Spine',
      'ECG',
      'Ultrasound - Abdomen',
      'Ultrasound - Heart',
      'MRI - Brain',
      'CT Scan - Chest',
      'Biopsy',
      'Culture Test'
    ];

    res.json({
      success: true,
      data: testTypes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

module.exports = router; 