const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Mock staff data
const staffMembers = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    role: 'Cardiologist',
    department: 'Cardiology',
    phone: '+880 1712-345678',
    email: 'sarah.johnson@hospital.com',
    status: 'Active',
    currentShift: 'Morning',
    nextShift: '2024-01-21 08:00 AM'
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    role: 'Anesthesiologist',
    department: 'Anesthesiology',
    phone: '+880 1712-345679',
    email: 'michael.chen@hospital.com',
    status: 'Active',
    currentShift: 'Night',
    nextShift: '2024-01-21 08:00 PM'
  },
  {
    id: 3,
    name: 'Nurse Aisha Rahman',
    role: 'Registered Nurse',
    department: 'ICU',
    phone: '+880 1712-345680',
    email: 'aisha.rahman@hospital.com',
    status: 'Active',
    currentShift: 'Evening',
    nextShift: '2024-01-21 02:00 PM'
  },
  {
    id: 4,
    name: 'Dr. Emily Davis',
    role: 'Surgeon',
    department: 'Surgery',
    phone: '+880 1712-345681',
    email: 'emily.davis@hospital.com',
    status: 'On Leave',
    currentShift: null,
    nextShift: '2024-01-25 08:00 AM'
  },
  {
    id: 5,
    name: 'Tech Ahmed Ali',
    role: 'Lab Technician',
    department: 'Laboratory',
    phone: '+880 1712-345682',
    email: 'ahmed.ali@hospital.com',
    status: 'Active',
    currentShift: 'Morning',
    nextShift: '2024-01-21 08:00 AM'
  }
];

// Mock roster data
const weeklyRoster = [
  {
    id: 1,
    staffName: 'Dr. Sarah Johnson',
    department: 'Cardiology',
    shiftType: 'Morning',
    startDate: '2024-01-20',
    endDate: '2024-01-26',
    startTime: '08:00 AM',
    endTime: '04:00 PM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    status: 'Confirmed',
    notes: 'Cardiac ward duty'
  },
  {
    id: 2,
    staffName: 'Dr. Michael Chen',
    department: 'Anesthesiology',
    shiftType: 'Night',
    startDate: '2024-01-20',
    endDate: '2024-01-26',
    startTime: '08:00 PM',
    endTime: '08:00 AM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    status: 'Confirmed',
    notes: 'Emergency anesthesia coverage'
  },
  {
    id: 3,
    staffName: 'Nurse Aisha Rahman',
    department: 'ICU',
    shiftType: 'Evening',
    startDate: '2024-01-20',
    endDate: '2024-01-26',
    startTime: '02:00 PM',
    endTime: '10:00 PM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    status: 'Pending',
    notes: 'ICU patient care'
  },
  {
    id: 4,
    staffName: 'Tech Ahmed Ali',
    department: 'Laboratory',
    shiftType: 'Morning',
    startDate: '2024-01-20',
    endDate: '2024-01-26',
    startTime: '08:00 AM',
    endTime: '04:00 PM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    status: 'Confirmed',
    notes: 'Lab testing and analysis'
  }
];

const departments = [
  'Cardiology',
  'Anesthesiology',
  'Surgery',
  'ICU',
  'Emergency',
  'Laboratory',
  'Radiology',
  'Pharmacy',
  'Nursing',
  'Administration'
];

const shiftTypes = [
  'Morning (8 AM - 4 PM)',
  'Evening (2 PM - 10 PM)',
  'Night (8 PM - 8 AM)',
  'Day (6 AM - 6 PM)',
  'Night (6 PM - 6 AM)',
  'Part-time (4 hours)',
  'On-call'
];

// @desc    Get all staff members
// @route   GET /api/roster/staff
// @access  Private
router.get('/staff', protect, (req, res) => {
  try {
    res.json({
      success: true,
      data: staffMembers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get weekly roster
// @route   GET /api/roster/weekly
// @access  Private
router.get('/weekly', protect, (req, res) => {
  try {
    res.json({
      success: true,
      data: weeklyRoster
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all roster entries
// @route   GET /api/roster
// @access  Private
router.get('/', protect, (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        staff: staffMembers,
        roster: weeklyRoster
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new shift schedule
// @route   POST /api/roster
// @access  Private
router.post('/', protect, (req, res) => {
  try {
    const {
      staffName,
      department,
      shiftType,
      startDate,
      endDate,
      startTime,
      endTime,
      days,
      notes
    } = req.body;

    // Validate required fields
    if (!staffName || !department || !shiftType || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const newShift = {
      id: weeklyRoster.length + 1,
      staffName,
      department,
      shiftType,
      startDate,
      endDate,
      startTime: startTime || '08:00 AM',
      endTime: endTime || '04:00 PM',
      days: days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      status: 'Pending',
      notes: notes || ''
    };

    weeklyRoster.push(newShift);

    res.status(201).json({
      success: true,
      message: 'Shift scheduled successfully',
      data: newShift
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update shift schedule
// @route   PUT /api/roster/:id
// @access  Private
router.put('/:id', protect, (req, res) => {
  try {
    const shiftIndex = weeklyRoster.findIndex(s => s.id === parseInt(req.params.id));
    
    if (shiftIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Shift not found'
      });
    }

    const updatedShift = { ...weeklyRoster[shiftIndex], ...req.body };
    weeklyRoster[shiftIndex] = updatedShift;

    res.json({
      success: true,
      message: 'Shift updated successfully',
      data: updatedShift
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get departments list
// @route   GET /api/roster/departments
// @access  Private
router.get('/departments/list', protect, (req, res) => {
  try {
    res.json({
      success: true,
      data: departments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get shift types list
// @route   GET /api/roster/shift-types
// @access  Private
router.get('/shift-types/list', protect, (req, res) => {
  try {
    res.json({
      success: true,
      data: shiftTypes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get staff by department
// @route   GET /api/roster/staff/department/:department
// @access  Private
router.get('/staff/department/:department', protect, (req, res) => {
  try {
    const departmentStaff = staffMembers.filter(staff => 
      staff.department.toLowerCase() === req.params.department.toLowerCase()
    );

    res.json({
      success: true,
      data: departmentStaff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Confirm shift
// @route   PUT /api/roster/:id/confirm
// @access  Private
router.put('/:id/confirm', protect, (req, res) => {
  try {
    const shiftIndex = weeklyRoster.findIndex(s => s.id === parseInt(req.params.id));
    
    if (shiftIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Shift not found'
      });
    }

    weeklyRoster[shiftIndex].status = 'Confirmed';

    res.json({
      success: true,
      message: 'Shift confirmed successfully',
      data: weeklyRoster[shiftIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 