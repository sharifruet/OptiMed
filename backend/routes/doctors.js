const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Private
router.get('/', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Doctors route - to be implemented'
  });
});

module.exports = router; 