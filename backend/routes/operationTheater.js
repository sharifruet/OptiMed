const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Operation Theater route - to be implemented'
  });
});

module.exports = router; 