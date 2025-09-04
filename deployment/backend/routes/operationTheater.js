const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Mock surgery data
const surgeries = [
  {
    id: 1,
    patientName: 'Ahmed Rahman',
    patientId: 'P001',
    surgeryType: 'Cardiac Bypass Surgery',
    surgeon: 'Dr. Sarah Johnson',
    anesthetist: 'Dr. Michael Chen',
    theaterNumber: 'OT-1',
    scheduledDate: '2024-01-20',
    scheduledTime: '09:00 AM',
    estimatedDuration: '4 hours',
    priority: 'High',
    status: 'In Progress',
    startTime: '09:15 AM',
    currentDuration: '2 hours 30 minutes',
    surgicalTeam: ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Nurse Aisha', 'Tech Ahmed'],
    notes: 'Complex cardiac procedure'
  },
  {
    id: 2,
    patientName: 'Fatima Begum',
    patientId: 'P002',
    surgeryType: 'Appendectomy',
    surgeon: 'Dr. Emily Davis',
    anesthetist: 'Dr. Robert Wilson',
    theaterNumber: 'OT-2',
    scheduledDate: '2024-01-20',
    scheduledTime: '11:00 AM',
    estimatedDuration: '1.5 hours',
    priority: 'Normal',
    status: 'Scheduled',
    startTime: null,
    currentDuration: null,
    surgicalTeam: ['Dr. Emily Davis', 'Dr. Robert Wilson', 'Nurse Fatima', 'Tech Ali'],
    notes: 'Laparoscopic procedure'
  },
  {
    id: 3,
    patientName: 'Mohammad Ali',
    patientId: 'P003',
    surgeryType: 'Hip Replacement',
    surgeon: 'Dr. Lisa Anderson',
    anesthetist: 'Dr. David Brown',
    theaterNumber: 'OT-3',
    scheduledDate: '2024-01-20',
    scheduledTime: '02:00 PM',
    estimatedDuration: '3 hours',
    priority: 'Normal',
    status: 'Completed',
    startTime: '02:15 PM',
    currentDuration: '2 hours 45 minutes',
    surgicalTeam: ['Dr. Lisa Anderson', 'Dr. David Brown', 'Nurse Sara', 'Tech Omar'],
    notes: 'Total hip replacement'
  }
];

const surgeryTypes = [
  'Cardiac Bypass Surgery',
  'Appendectomy',
  'Hip Replacement',
  'Knee Replacement',
  'C-Section',
  'Hernia Repair',
  'Gallbladder Removal',
  'Tonsillectomy',
  'Cataract Surgery',
  'Brain Surgery',
  'Lung Surgery',
  'Kidney Transplant'
];

const theaters = ['OT-1', 'OT-2', 'OT-3', 'OT-4', 'OT-5'];

// @desc    Get all surgeries
// @route   GET /api/ot
// @access  Private
router.get('/', protect, (req, res) => {
  try {
    res.json({
      success: true,
      data: surgeries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single surgery
// @route   GET /api/ot/:id
// @access  Private
router.get('/:id', protect, (req, res) => {
  try {
    const surgery = surgeries.find(s => s.id === parseInt(req.params.id));
    
    if (!surgery) {
      return res.status(404).json({
        success: false,
        message: 'Surgery not found'
      });
    }

    res.json({
      success: true,
      data: surgery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Schedule new surgery
// @route   POST /api/ot
// @access  Private
router.post('/', protect, (req, res) => {
  try {
    const {
      patientName,
      patientId,
      surgeryType,
      surgeon,
      anesthetist,
      theaterNumber,
      scheduledDate,
      scheduledTime,
      estimatedDuration,
      priority,
      notes
    } = req.body;

    if (!patientName || !patientId || !surgeryType || !surgeon || !theaterNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const newSurgery = {
      id: surgeries.length + 1,
      patientName,
      patientId,
      surgeryType,
      surgeon,
      anesthetist: anesthetist || 'TBD',
      theaterNumber,
      scheduledDate,
      scheduledTime,
      estimatedDuration: estimatedDuration || '2 hours',
      priority: priority || 'Normal',
      status: 'Scheduled',
      startTime: null,
      currentDuration: null,
      surgicalTeam: [surgeon, anesthetist || 'TBD'],
      notes: notes || ''
    };

    surgeries.push(newSurgery);

    res.status(201).json({
      success: true,
      message: 'Surgery scheduled successfully',
      data: newSurgery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get surgery types
// @route   GET /api/ot/types
// @access  Private
router.get('/types/list', protect, (req, res) => {
  try {
    res.json({
      success: true,
      data: surgeryTypes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get theaters
// @route   GET /api/ot/theaters
// @access  Private
router.get('/theaters/list', protect, (req, res) => {
  try {
    res.json({
      success: true,
      data: theaters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 