const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { lookupIP } = require('../controllers/ipReputationController');

// All logged-in roles may perform a reputation lookup; this stores lookup history/counters.
router.post('/lookup', protect(['admin', 'analyst', 'researcher']), lookupIP);
module.exports = router;
