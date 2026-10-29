const express = require('express');
const router = express.Router();
const { lookupIP } = require('../controllers/ipReputationController');

// POST /api/ip-reputation/lookup stores and returns a local lookup result.
router.post('/lookup', lookupIP);

module.exports = router;
