const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Mock emergency data (in a real app, this would come from a database)
let emergencyCases = [
  {
    id: 1,
    patientName: 'Ahmed Rahman',
    patientId: 'E001',
    age: 45,
    gender: 'Male',
    phone: '+880 1712-123456',
    emergencyContact: '+880 1812-654321',
    chiefComplaint: 'Chest Pain',
    triageLevel: 'Red',
    arrivalMethod: 'Ambulance',
    assignedDoctor: 'Dr. Sarah Johnson',
    arrivalTime: '2024-01-20 14:30',
    status: 'Under Treatment',
    vitalSigns: {
      bp: '180/110',
      pulse: '120',
      temperature: '98.6°F',
      oxygen: '95%'
    },
    treatmentPlan: 'ECG, cardiac enzymes, immediate intervention',
    notes: 'Critical condition, requires immediate attention',
    ambulanceId: 'AMB-001',
    estimatedArrival: '5 minutes'
  },
  {
    id: 2,
    patientName: 'Fatima Begum',
    patientId: 'E002',
    age: 32,
    gender: 'Female',
    phone: '+880 1812-234567',
    emergencyContact: '+880 1912-765432',
    chiefComplaint: 'Severe Abdominal Pain',
    triageLevel: 'Orange',
    arrivalMethod: 'Private Vehicle',
    assignedDoctor: 'Dr. Michael Chen',
    arrivalTime: '2024-01-20 15:15',
    status: 'Waiting for Surgery',
    vitalSigns: {
      bp: '140/90',
      pulse: '95',
      temperature: '100.2°F',
      oxygen: '98%'
    },
    treatmentPlan: 'Appendectomy, IV antibiotics',
    notes: 'Suspected appendicitis, surgery scheduled',
    ambulanceId: null,
    estimatedArrival: null
  },
  {
    id: 3,
    patientName: 'Mohammad Ali',
    patientId: 'E003',
    age: 28,
    gender: 'Male',
    phone: '+880 1912-345678',
    emergencyContact: '+880 1612-876543',
    chiefComplaint: 'Road Traffic Accident',
    triageLevel: 'Red',
    arrivalMethod: 'Ambulance',
    assignedDoctor: 'Dr. Emily Davis',
    arrivalTime: '2024-01-20 16:00',
    status: 'In Surgery',
    vitalSigns: {
      bp: '90/60',
      pulse: '140',
      temperature: '96.8°F',
      oxygen: '88%'
    },
    treatmentPlan: 'Emergency surgery, blood transfusion',
    notes: 'Multiple injuries, critical condition',
    ambulanceId: 'AMB-002',
    estimatedArrival: '10 minutes'
  },
  {
    id: 4,
    patientName: 'Aisha Khan',
    patientId: 'E004',
    age: 55,
    gender: 'Female',
    phone: '+880 1612-456789',
    emergencyContact: '+880 1512-987654',
    chiefComplaint: 'Difficulty Breathing',
    triageLevel: 'Yellow',
    arrivalMethod: 'Ambulance',
    assignedDoctor: 'Dr. Robert Wilson',
    arrivalTime: '2024-01-20 16:45',
    status: 'Under Observation',
    vitalSigns: {
      bp: '130/85',
      pulse: '85',
      temperature: '99.5°F',
      oxygen: '91%'
    },
    treatmentPlan: 'Oxygen therapy, bronchodilators',
    notes: 'Asthma exacerbation, responding to treatment',
    ambulanceId: 'AMB-003',
    estimatedArrival: '15 minutes'
  }
];

// @desc    Get all emergency cases
// @route   GET /api/emergency
// @access  Private
router.get('/', protect, (req, res) => {
  try {
    res.json({
      success: true,
      data: emergencyCases,
      count: emergencyCases.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Create new emergency case
// @route   POST /api/emergency
// @access  Private
router.post('/', protect, (req, res) => {
  try {
    const { 
      patientName, 
      patientId, 
      age, 
      gender, 
      phone, 
      emergencyContact, 
      chiefComplaint, 
      triageLevel, 
      arrivalMethod, 
      assignedDoctor, 
      notes 
    } = req.body;

    // Basic validation
    if (!patientName || !patientId || !chiefComplaint || !assignedDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Generate ambulance ID if arrival method is ambulance
    const ambulanceId = arrivalMethod === 'Ambulance' ? generateAmbulanceId() : null;
    const estimatedArrival = arrivalMethod === 'Ambulance' ? generateEstimatedArrival() : null;

    const newCase = {
      id: emergencyCases.length + 1,
      patientName,
      patientId,
      age: parseInt(age) || 0,
      gender,
      phone,
      emergencyContact,
      chiefComplaint,
      triageLevel: triageLevel || 'Green',
      arrivalMethod: arrivalMethod || 'Walk-in',
      assignedDoctor,
      arrivalTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Under Treatment',
      vitalSigns: {
        bp: '120/80',
        pulse: '72',
        temperature: '98.6°F',
        oxygen: '98%'
      },
      treatmentPlan: 'To be determined by assigned doctor',
      notes: notes || '',
      ambulanceId,
      estimatedArrival
    };

    emergencyCases.push(newCase);

    res.status(201).json({
      success: true,
      data: newCase,
      message: 'Emergency case created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Update emergency case
// @route   PUT /api/emergency/:id
// @access  Private
router.put('/:id', protect, (req, res) => {
  try {
    const { 
      status, 
      treatmentPlan, 
      notes, 
      vitalSigns 
    } = req.body;
    const caseId = parseInt(req.params.id);

    const caseIndex = emergencyCases.findIndex(emergencyCase => emergencyCase.id === caseId);
    
    if (caseIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Emergency case not found'
      });
    }

    // Update the case
    if (status) emergencyCases[caseIndex].status = status;
    if (treatmentPlan) emergencyCases[caseIndex].treatmentPlan = treatmentPlan;
    if (notes) emergencyCases[caseIndex].notes = notes;
    if (vitalSigns) emergencyCases[caseIndex].vitalSigns = vitalSigns;

    res.json({
      success: true,
      data: emergencyCases[caseIndex],
      message: 'Emergency case updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get emergency case by ID
// @route   GET /api/emergency/:id
// @access  Private
router.get('/:id', protect, (req, res) => {
  try {
    const emergencyCase = emergencyCases.find(c => c.id === parseInt(req.params.id));
    
    if (!emergencyCase) {
      return res.status(404).json({
        success: false,
        message: 'Emergency case not found'
      });
    }

    res.json({
      success: true,
      data: emergencyCase
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get triage levels
// @route   GET /api/emergency/triage-levels
// @access  Private
router.get('/triage-levels', protect, (req, res) => {
  try {
    const triageLevels = [
      { level: 'Red', label: 'Immediate', color: 'danger', description: 'Life-threatening' },
      { level: 'Orange', label: 'Very Urgent', color: 'warning', description: 'Within 10 minutes' },
      { level: 'Yellow', label: 'Urgent', color: 'info', description: 'Within 1 hour' },
      { level: 'Green', label: 'Non-urgent', color: 'success', description: 'Within 4 hours' },
      { level: 'Blue', label: 'Minor', color: 'secondary', description: 'Within 24 hours' }
    ];

    res.json({
      success: true,
      data: triageLevels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get arrival methods
// @route   GET /api/emergency/arrival-methods
// @access  Private
router.get('/arrival-methods', protect, (req, res) => {
  try {
    const arrivalMethods = [
      'Ambulance',
      'Private Vehicle',
      'Walk-in',
      'Police',
      'Fire Department'
    ];

    res.json({
      success: true,
      data: arrivalMethods
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get ambulance status
// @route   GET /api/emergency/ambulance-status
// @access  Private
router.get('/ambulance-status', protect, (req, res) => {
  try {
    const ambulanceStatus = [
      {
        id: 'AMB-001',
        status: 'En Route',
        location: 'Dhaka Central',
        estimatedArrival: '5 minutes',
        assignedCase: 'E001'
      },
      {
        id: 'AMB-002',
        status: 'At Hospital',
        location: 'Hospital Grounds',
        estimatedArrival: 'Arrived',
        assignedCase: 'E003'
      },
      {
        id: 'AMB-003',
        status: 'En Route',
        location: 'Gulshan Area',
        estimatedArrival: '15 minutes',
        assignedCase: 'E004'
      }
    ];

    res.json({
      success: true,
      data: ambulanceStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// Helper function to generate ambulance ID
function generateAmbulanceId() {
  const randomNumber = Math.floor(Math.random() * 999) + 1;
  return `AMB-${randomNumber.toString().padStart(3, '0')}`;
}

// Helper function to generate estimated arrival time
function generateEstimatedArrival() {
  const minutes = Math.floor(Math.random() * 20) + 5; // 5-25 minutes
  return `${minutes} minutes`;
}

module.exports = router; 