const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getSettings, updateSettings } = require('../controllers/settingsController');

router.get('/', protect(['admin', 'analyst', 'researcher']), getSettings);
router.put('/', protect(['admin']), updateSettings);
module.exports = router;
