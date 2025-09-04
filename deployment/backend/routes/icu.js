const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Mock ICU patients data
const icuPatients = [
  {
    id: 1,
    patientName: 'Ahmed Rahman',
    patientId: 'P001',
    age: 65,
    gender: 'Male',
    diagnosis: 'Acute Respiratory Distress Syndrome (ARDS)',
    admittingDoctor: 'Dr. Sarah Johnson',
    bedNumber: 'ICU-01',
    admissionDate: '2024-01-18',
    estimatedStay: '7-10 days',
    priority: 'Critical',
    status: 'Critical',
    vitalSigns: {
      bp: '90/60',
      pulse: '120',
      temperature: '38.5°C',
      oxygen: '85%',
      respiratoryRate: '28/min',
      consciousness: 'GCS 8/15'
    },
    medications: ['Vasopressors', 'Antibiotics', 'Sedatives'],
    equipment: ['Ventilator', 'ECG Monitor', 'Pulse Oximeter'],
    lastUpdate: '2 minutes ago',
    alerts: ['Low Blood Pressure', 'High Temperature']
  },
  {
    id: 2,
    patientName: 'Fatima Begum',
    patientId: 'P002',
    age: 45,
    gender: 'Female',
    diagnosis: 'Septic Shock',
    admittingDoctor: 'Dr. Michael Chen',
    bedNumber: 'ICU-02',
    admissionDate: '2024-01-19',
    estimatedStay: '5-7 days',
    priority: 'High',
    status: 'Stable',
    vitalSigns: {
      bp: '110/70',
      pulse: '95',
      temperature: '37.2°C',
      oxygen: '96%',
      respiratoryRate: '18/min',
      consciousness: 'GCS 15/15'
    },
    medications: ['Antibiotics', 'IV Fluids', 'Pain Management'],
    equipment: ['ECG Monitor', 'Pulse Oximeter', 'IV Pump'],
    lastUpdate: '5 minutes ago',
    alerts: []
  },
  {
    id: 3,
    patientName: 'Mohammad Ali',
    patientId: 'P003',
    age: 72,
    gender: 'Male',
    diagnosis: 'Post-Cardiac Surgery',
    admittingDoctor: 'Dr. Emily Davis',
    bedNumber: 'ICU-03',
    admissionDate: '2024-01-20',
    estimatedStay: '3-5 days',
    priority: 'High',
    status: 'Improving',
    vitalSigns: {
      bp: '130/80',
      pulse: '75',
      temperature: '36.8°C',
      oxygen: '98%',
      respiratoryRate: '16/min',
      consciousness: 'GCS 15/15'
    },
    medications: ['Anticoagulants', 'Pain Management', 'Antibiotics'],
    equipment: ['ECG Monitor', 'Pulse Oximeter', 'Chest Drain'],
    lastUpdate: '10 minutes ago',
    alerts: []
  },
  {
    id: 4,
    patientName: 'Aisha Khan',
    patientId: 'P004',
    age: 28,
    gender: 'Female',
    diagnosis: 'Traumatic Brain Injury',
    admittingDoctor: 'Dr. Lisa Anderson',
    bedNumber: 'ICU-04',
    admissionDate: '2024-01-20',
    estimatedStay: '10-14 days',
    priority: 'Critical',
    status: 'Critical',
    vitalSigns: {
      bp: '140/90',
      pulse: '110',
      temperature: '37.5°C',
      oxygen: '92%',
      respiratoryRate: '22/min',
      consciousness: 'GCS 6/15'
    },
    medications: ['Mannitol', 'Anticonvulsants', 'Sedatives'],
    equipment: ['Ventilator', 'ICP Monitor', 'ECG Monitor'],
    lastUpdate: '1 minute ago',
    alerts: ['Increased ICP', 'Decreased Consciousness']
  }
];

const bedTypes = [
  'ICU-01', 'ICU-02', 'ICU-03', 'ICU-04', 'ICU-05', 'ICU-06', 'ICU-07', 'ICU-08'
];

const diagnoses = [
  'Acute Respiratory Distress Syndrome (ARDS)',
  'Septic Shock',
  'Post-Cardiac Surgery',
  'Traumatic Brain Injury',
  'Multiple Organ Failure',
  'Acute Kidney Injury',
  'Severe Pneumonia',
  'Cardiac Arrest',
  'Stroke',
  'Severe Trauma',
  'Burns',
  'Post-Transplant'
];

// @desc    Get all ICU patients
// @route   GET /api/icu
// @access  Private
router.get('/', protect, (req, res) => {
  try {
    res.json({
      success: true,
      data: icuPatients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single ICU patient
// @route   GET /api/icu/:id
// @access  Private
router.get('/:id', protect, (req, res) => {
  try {
    const patient = icuPatients.find(p => p.id === parseInt(req.params.id));
    
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
      message: 'Server error'
    });
  }
});

// @desc    Create new ICU admission
// @route   POST /api/icu
// @access  Private
router.post('/', protect, (req, res) => {
  try {
    const {
      patientName,
      patientId,
      age,
      gender,
      diagnosis,
      admittingDoctor,
      bedNumber,
      admissionDate,
      estimatedStay,
      priority,
      notes
    } = req.body;

    // Validate required fields
    if (!patientName || !patientId || !diagnosis || !admittingDoctor || !bedNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if bed is available
    const bedOccupied = icuPatients.find(p => p.bedNumber === bedNumber);
    if (bedOccupied) {
      return res.status(400).json({
        success: false,
        message: 'Bed is already occupied'
      });
    }

    const newPatient = {
      id: icuPatients.length + 1,
      patientName,
      patientId,
      age: parseInt(age) || 0,
      gender,
      diagnosis,
      admittingDoctor,
      bedNumber,
      admissionDate: admissionDate || new Date().toISOString().split('T')[0],
      estimatedStay: estimatedStay || '5-7 days',
      priority: priority || 'High',
      status: 'Critical',
      vitalSigns: {
        bp: '120/80',
        pulse: '80',
        temperature: '37.0°C',
        oxygen: '98%',
        respiratoryRate: '16/min',
        consciousness: 'GCS 15/15'
      },
      medications: [],
      equipment: ['ECG Monitor', 'Pulse Oximeter'],
      lastUpdate: 'Just now',
      alerts: [],
      notes: notes || ''
    };

    icuPatients.push(newPatient);

    res.status(201).json({
      success: true,
      message: 'Patient admitted to ICU successfully',
      data: newPatient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update ICU patient
// @route   PUT /api/icu/:id
// @access  Private
router.put('/:id', protect, (req, res) => {
  try {
    const patientIndex = icuPatients.findIndex(p => p.id === parseInt(req.params.id));
    
    if (patientIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const updatedPatient = { ...icuPatients[patientIndex], ...req.body };
    icuPatients[patientIndex] = updatedPatient;

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: updatedPatient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get available beds
// @route   GET /api/icu/beds/available
// @access  Private
router.get('/beds/available', protect, (req, res) => {
  try {
    const occupiedBeds = icuPatients.map(p => p.bedNumber);
    const availableBeds = bedTypes.filter(bed => !occupiedBeds.includes(bed));

    res.json({
      success: true,
      data: {
        total: bedTypes.length,
        occupied: occupiedBeds.length,
        available: availableBeds.length,
        availableBeds
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get diagnoses list
// @route   GET /api/icu/diagnoses
// @access  Private
router.get('/diagnoses/list', protect, (req, res) => {
  try {
    res.json({
      success: true,
      data: diagnoses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update vital signs
// @route   PUT /api/icu/:id/vitals
// @access  Private
router.put('/:id/vitals', protect, (req, res) => {
  try {
    const patientIndex = icuPatients.findIndex(p => p.id === parseInt(req.params.id));
    
    if (patientIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const { vitalSigns } = req.body;
    
    if (!vitalSigns) {
      return res.status(400).json({
        success: false,
        message: 'Vital signs data is required'
      });
    }

    icuPatients[patientIndex].vitalSigns = { ...icuPatients[patientIndex].vitalSigns, ...vitalSigns };
    icuPatients[patientIndex].lastUpdate = 'Just now';

    res.json({
      success: true,
      message: 'Vital signs updated successfully',
      data: icuPatients[patientIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 