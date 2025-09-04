const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Mock doctors data (in a real app, this would come from a database)
const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    phone: '+880 1712-345678',
    specialization: 'Cardiology',
    experience: '15 years',
    status: 'Active',
    department: 'Cardiology',
    patients: 245,
    rating: 4.8
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    email: 'michael.chen@hospital.com',
    phone: '+880 1812-345679',
    specialization: 'Neurology',
    experience: '12 years',
    status: 'Active',
    department: 'Neurology',
    patients: 189,
    rating: 4.9
  },
  {
    id: 3,
    name: 'Dr. Emily Davis',
    email: 'emily.davis@hospital.com',
    phone: '+880 1912-345680',
    specialization: 'Pediatrics',
    experience: '8 years',
    status: 'Active',
    department: 'Pediatrics',
    patients: 156,
    rating: 4.7
  },
  {
    id: 4,
    name: 'Dr. Robert Wilson',
    email: 'robert.wilson@hospital.com',
    phone: '+880 1612-345681',
    specialization: 'Orthopedics',
    experience: '20 years',
    status: 'Active',
    department: 'Orthopedics',
    patients: 312,
    rating: 4.6
  },
  {
    id: 5,
    name: 'Dr. Lisa Anderson',
    email: 'lisa.anderson@hospital.com',
    phone: '+880 1512-345682',
    specialization: 'Dermatology',
    experience: '10 years',
    status: 'Inactive',
    department: 'Dermatology',
    patients: 98,
    rating: 4.5
  }
];

// Mock doctor schedules data
let doctorSchedules = [
  {
    id: 1,
    doctorId: 1,
    doctorName: 'Dr. Sarah Johnson',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    slotDuration: 30, // minutes
    breakTime: {
      start: '12:00',
      end: '13:00'
    },
    dayOffs: ['Saturday', 'Sunday'],
    isActive: true
  },
  {
    id: 2,
    doctorId: 2,
    doctorName: 'Dr. Michael Chen',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: {
      start: '08:00',
      end: '16:00'
    },
    slotDuration: 45, // minutes
    breakTime: {
      start: '12:30',
      end: '13:30'
    },
    dayOffs: ['Sunday'],
    isActive: true
  },
  {
    id: 3,
    doctorId: 3,
    doctorName: 'Dr. Emily Davis',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: {
      start: '10:00',
      end: '18:00'
    },
    slotDuration: 30, // minutes
    breakTime: {
      start: '13:00',
      end: '14:00'
    },
    dayOffs: ['Saturday', 'Sunday'],
    isActive: true
  },
  {
    id: 4,
    doctorId: 4,
    doctorName: 'Dr. Robert Wilson',
    workingDays: ['Monday', 'Wednesday', 'Friday'],
    workingHours: {
      start: '09:00',
      end: '15:00'
    },
    slotDuration: 60, // minutes
    breakTime: {
      start: '12:00',
      end: '13:00'
    },
    dayOffs: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'],
    isActive: true
  },
  {
    id: 5,
    doctorId: 5,
    doctorName: 'Dr. Lisa Anderson',
    workingDays: ['Tuesday', 'Thursday'],
    workingHours: {
      start: '14:00',
      end: '18:00'
    },
    slotDuration: 30, // minutes
    breakTime: {
      start: '15:30',
      end: '16:00'
    },
    dayOffs: ['Monday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'],
    isActive: false
  }
];

// Helper function to generate available slots for a doctor on a specific date
const generateAvailableSlots = (doctorId, date) => {
  const schedule = doctorSchedules.find(s => s.doctorId === doctorId && s.isActive);
  if (!schedule) return [];

  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  
  // Check if doctor works on this day
  if (!schedule.workingDays.includes(dayOfWeek)) {
    return [];
  }

  const slots = [];
  const startTime = new Date(`2000-01-01T${schedule.workingHours.start}`);
  const endTime = new Date(`2000-01-01T${schedule.workingHours.end}`);
  const breakStart = new Date(`2000-01-01T${schedule.breakTime.start}`);
  const breakEnd = new Date(`2000-01-01T${schedule.breakTime.end}`);

  let currentTime = new Date(startTime);
  
  while (currentTime < endTime) {
    const slotEnd = new Date(currentTime.getTime() + schedule.slotDuration * 60000);
    
    // Skip break time
    if (currentTime >= breakStart && currentTime < breakEnd) {
      currentTime = breakEnd;
      continue;
    }
    
    // Skip if slot extends into break time
    if (slotEnd > breakStart && currentTime < breakEnd) {
      currentTime = breakEnd;
      continue;
    }
    
    // Skip if slot extends beyond working hours
    if (slotEnd > endTime) {
      break;
    }
    
    const timeString = currentTime.toTimeString().slice(0, 5);
    slots.push({
      time: timeString,
      available: true,
      slotId: `${doctorId}-${date}-${timeString}`
    });
    
    currentTime = slotEnd;
  }
  
  return slots;
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Private
router.get('/', protect, (req, res) => {
  try {
    res.json({
      success: true,
      data: doctors,
      count: doctors.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Private
router.get('/:id', protect, (req, res) => {
  try {
    const doctor = doctors.find(d => d.id === parseInt(req.params.id));
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get doctor schedule
// @route   GET /api/doctors/:id/schedule
// @access  Private
router.get('/:id/schedule', protect, (req, res) => {
  try {
    const doctorId = parseInt(req.params.id);
    const schedule = doctorSchedules.find(s => s.doctorId === doctorId);
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Doctor schedule not found'
      });
    }

    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Update doctor schedule
// @route   PUT /api/doctors/:id/schedule
// @access  Private
router.put('/:id/schedule', protect, (req, res) => {
  try {
    const doctorId = parseInt(req.params.id);
    const { workingDays, workingHours, slotDuration, breakTime, dayOffs, isActive } = req.body;
    
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    let schedule = doctorSchedules.find(s => s.doctorId === doctorId);
    
    if (schedule) {
      // Update existing schedule
      schedule = { ...schedule, workingDays, workingHours, slotDuration, breakTime, dayOffs, isActive };
      const index = doctorSchedules.findIndex(s => s.doctorId === doctorId);
      doctorSchedules[index] = schedule;
    } else {
      // Create new schedule
      schedule = {
        id: doctorSchedules.length + 1,
        doctorId,
        doctorName: doctor.name,
        workingDays,
        workingHours,
        slotDuration,
        breakTime,
        dayOffs,
        isActive
      };
      doctorSchedules.push(schedule);
    }

    res.json({
      success: true,
      data: schedule,
      message: 'Doctor schedule updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get available slots for a doctor on a specific date
// @route   GET /api/doctors/:id/slots
// @access  Private
router.get('/:id/slots', protect, (req, res) => {
  try {
    const doctorId = parseInt(req.params.id);
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required'
      });
    }

    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const availableSlots = generateAvailableSlots(doctorId, date);
    
    res.json({
      success: true,
      data: {
        doctor,
        date,
        slots: availableSlots,
        totalSlots: availableSlots.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get all doctor schedules
// @route   GET /api/doctors/schedules/all
// @access  Private
router.get('/schedules/all', protect, (req, res) => {
  try {
    res.json({
      success: true,
      data: doctorSchedules,
      count: doctorSchedules.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

module.exports = router; 