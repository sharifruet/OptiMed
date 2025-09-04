const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get pharmacy items
// @route   GET /api/pharmacy
// @access  Private
router.get('/', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Pharmacy route - to be implemented'
  });
});

module.exports = router; 