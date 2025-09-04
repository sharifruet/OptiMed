const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Mock appointments data (in a real app, this would come from a database)
let appointments = [
  {
    id: 1,
    patientName: 'Ahmed Rahman',
    patientPhone: '+880 1712-123456',
    doctorName: 'Dr. Sarah Johnson',
    date: '2024-01-20',
    time: '09:00 AM',
    type: 'Consultation',
    status: 'Scheduled',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    patientName: 'Fatima Begum',
    patientPhone: '+880 1812-234567',
    doctorName: 'Dr. Michael Chen',
    date: '2024-01-20',
    time: '10:30 AM',
    type: 'Follow-up',
    status: 'Completed',
    createdAt: '2024-01-16T14:20:00Z'
  },
  {
    id: 3,
    patientName: 'Mohammad Ali',
    patientPhone: '+880 1912-345678',
    doctorName: 'Dr. Emily Davis',
    date: '2024-01-21',
    time: '02:00 PM',
    type: 'Emergency',
    status: 'Cancelled',
    createdAt: '2024-01-17T09:15:00Z'
  }
];

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
router.get('/', protect, (req, res) => {
  try {
    res.json({
      success: true,
      data: appointments,
      count: appointments.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
router.post('/', protect, (req, res) => {
  try {
    const { patientName, patientPhone, doctorId, doctorName, date, time, type } = req.body;

    // Basic validation
    if (!patientName || !patientPhone || !doctorId || !doctorName || !date || !time || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if slot is already booked
    const existingAppointment = appointments.find(
      apt => apt.doctorId === doctorId && apt.date === date && apt.time === time && apt.status !== 'Cancelled'
    );

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked. Please select another time.'
      });
    }

    const newAppointment = {
      id: appointments.length + 1,
      patientName,
      patientPhone,
      doctorId: parseInt(doctorId),
      doctorName,
      date,
      time,
      type,
      status: 'Scheduled',
      createdAt: new Date().toISOString()
    };

    appointments.push(newAppointment);

    res.status(201).json({
      success: true,
      data: newAppointment,
      message: 'Appointment created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
router.get('/:id', protect, (req, res) => {
  try {
    const appointment = appointments.find(a => a.id === parseInt(req.params.id));
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

module.exports = router; 