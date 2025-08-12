const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
router.get('/', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Appointments route - to be implemented'
  });
});

module.exports = router; 