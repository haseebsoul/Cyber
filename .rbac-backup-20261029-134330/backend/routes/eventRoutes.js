const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getEvents, createEvent } = require('../controllers/eventController');

router.get('/', protect(['admin', 'analyst', 'researcher']), getEvents);
router.post('/', protect(['admin', 'analyst']), createEvent);

module.exports = router;
