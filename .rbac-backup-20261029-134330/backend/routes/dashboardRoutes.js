const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getDashboardStats } = require('../controllers/dashboardController');

router.get('/stats', protect(['admin', 'analyst', 'researcher']), getDashboardStats);
module.exports = router;
