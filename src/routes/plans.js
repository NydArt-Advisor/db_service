const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');

// GET /plans - return all active plans
router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true });
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 