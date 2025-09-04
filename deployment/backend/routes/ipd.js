const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Mock IPD data (in a real app, this would come from a database)
let ipdPatients = [
  {
    id: 1,
    patientName: 'Ahmed Rahman',
    patientId: 'P001',
    age: 45,
    gender: 'Male',
    phone: '+880 1712-123456',
    emergencyContact: '+880 1812-654321',
    admittingDoctor: 'Dr. Sarah Johnson',
    diagnosis: 'Acute Myocardial Infarction',
    roomType: 'ICU',
    roomNumber: 'ICU-101',
    admissionDate: '2024-01-18',
    estimatedStay: '7 days',
    currentStay: '3 days',
    status: 'Admitted',
    vitalSigns: {
      bp: '140/90',
      pulse: '85',
      temperature: '98.6°F',
      oxygen: '98%'
    },
    treatmentPlan: 'Cardiac monitoring, medication therapy',
    notes: 'Stable condition, responding well to treatment'
  },
  {
    id: 2,
    patientName: 'Fatima Begum',
    patientId: 'P002',
    age: 32,
    gender: 'Female',
    phone: '+880 1812-234567',
    emergencyContact: '+880 1912-765432',
    admittingDoctor: 'Dr. Michael Chen',
    diagnosis: 'Appendicitis',
    roomType: 'General Ward',
    roomNumber: 'GW-205',
    admissionDate: '2024-01-19',
    estimatedStay: '5 days',
    currentStay: '2 days',
    status: 'Admitted',
    vitalSigns: {
      bp: '120/80',
      pulse: '72',
      temperature: '99.2°F',
      oxygen: '99%'
    },
    treatmentPlan: 'Post-operative care, antibiotics',
    notes: 'Recovering well after surgery'
  },
  {
    id: 3,
    patientName: 'Mohammad Ali',
    patientId: 'P003',
    age: 28,
    gender: 'Male',
    phone: '+880 1912-345678',
    emergencyContact: '+880 1612-876543',
    admittingDoctor: 'Dr. Emily Davis',
    diagnosis: 'Pneumonia',
    roomType: 'Semi-Private',
    roomNumber: 'SP-301',
    admissionDate: '2024-01-20',
    estimatedStay: '10 days',
    currentStay: '1 day',
    status: 'Admitted',
    vitalSigns: {
      bp: '135/85',
      pulse: '95',
      temperature: '101.5°F',
      oxygen: '92%'
    },
    treatmentPlan: 'Antibiotics, oxygen therapy',
    notes: 'Requires close monitoring'
  },
  {
    id: 4,
    patientName: 'Aisha Khan',
    patientId: 'P004',
    age: 55,
    gender: 'Female',
    phone: '+880 1612-456789',
    emergencyContact: '+880 1512-987654',
    admittingDoctor: 'Dr. Robert Wilson',
    diagnosis: 'Hip Fracture',
    roomType: 'Private',
    roomNumber: 'PR-401',
    admissionDate: '2024-01-15',
    estimatedStay: '14 days',
    currentStay: '6 days',
    status: 'Ready for Discharge',
    vitalSigns: {
      bp: '125/82',
      pulse: '78',
      temperature: '98.8°F',
      oxygen: '97%'
    },
    treatmentPlan: 'Physical therapy, pain management',
    notes: 'Ready for discharge, follow-up scheduled'
  }
];

// @desc    Get all IPD patients
// @route   GET /api/ipd
// @access  Private
router.get('/', protect, (req, res) => {
  try {
    res.json({
      success: true,
      data: ipdPatients,
      count: ipdPatients.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Create new IPD admission
// @route   POST /api/ipd
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
      admittingDoctor, 
      diagnosis, 
      roomType, 
      estimatedStay, 
      notes 
    } = req.body;

    // Basic validation
    if (!patientName || !patientId || !admittingDoctor || !diagnosis || !roomType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Generate room number based on room type
    const roomNumber = generateRoomNumber(roomType);

    const newAdmission = {
      id: ipdPatients.length + 1,
      patientName,
      patientId,
      age: parseInt(age) || 0,
      gender,
      phone,
      emergencyContact,
      admittingDoctor,
      diagnosis,
      roomType,
      roomNumber,
      admissionDate: new Date().toISOString().split('T')[0],
      estimatedStay,
      currentStay: '0 days',
      status: 'Admitted',
      vitalSigns: {
        bp: '120/80',
        pulse: '72',
        temperature: '98.6°F',
        oxygen: '98%'
      },
      treatmentPlan: 'To be determined by admitting doctor',
      notes: notes || ''
    };

    ipdPatients.push(newAdmission);

    res.status(201).json({
      success: true,
      data: newAdmission,
      message: 'Patient admitted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Update IPD patient
// @route   PUT /api/ipd/:id
// @access  Private
router.put('/:id', protect, (req, res) => {
  try {
    const { 
      status, 
      treatmentPlan, 
      notes, 
      vitalSigns 
    } = req.body;
    const patientId = parseInt(req.params.id);

    const patientIndex = ipdPatients.findIndex(patient => patient.id === patientId);
    
    if (patientIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Update the patient
    if (status) ipdPatients[patientIndex].status = status;
    if (treatmentPlan) ipdPatients[patientIndex].treatmentPlan = treatmentPlan;
    if (notes) ipdPatients[patientIndex].notes = notes;
    if (vitalSigns) ipdPatients[patientIndex].vitalSigns = vitalSigns;

    res.json({
      success: true,
      data: ipdPatients[patientIndex],
      message: 'Patient updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get IPD patient by ID
// @route   GET /api/ipd/:id
// @access  Private
router.get('/:id', protect, (req, res) => {
  try {
    const patient = ipdPatients.find(p => p.id === parseInt(req.params.id));
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get room types
// @route   GET /api/ipd/room-types
// @access  Private
router.get('/room-types', protect, (req, res) => {
  try {
    const roomTypes = [
      'ICU',
      'General Ward',
      'Semi-Private',
      'Private',
      'Isolation'
    ];

    res.json({
      success: true,
      data: roomTypes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get room availability
// @route   GET /api/ipd/room-availability
// @access  Private
router.get('/room-availability', protect, (req, res) => {
  try {
    const roomAvailability = {
      'ICU': { total: 10, occupied: 3, available: 7 },
      'General Ward': { total: 50, occupied: 25, available: 25 },
      'Semi-Private': { total: 20, occupied: 12, available: 8 },
      'Private': { total: 15, occupied: 8, available: 7 },
      'Isolation': { total: 5, occupied: 1, available: 4 }
    };

    res.json({
      success: true,
      data: roomAvailability
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// Helper function to generate room number
function generateRoomNumber(roomType) {
  const prefix = {
    'ICU': 'ICU',
    'General Ward': 'GW',
    'Semi-Private': 'SP',
    'Private': 'PR',
    'Isolation': 'ISO'
  };
  
  const randomNumber = Math.floor(Math.random() * 999) + 1;
  return `${prefix[roomType]}-${randomNumber.toString().padStart(3, '0')}`;
}

module.exports = router; 