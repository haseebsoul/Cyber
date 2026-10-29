const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getThreats, createThreat, updateThreatAction, deleteThreat } = require('../controllers/threatController');

// All three roles may read threat data.
router.get('/', protect(['admin', 'analyst', 'researcher']), getThreats);
// Researchers can read only; Admin and Analyst may change threat records.
router.post('/', protect(['admin', 'analyst']), createThreat);
router.put('/:id', protect(['admin', 'analyst']), updateThreatAction);
router.delete('/:id', protect(['admin', 'analyst']), deleteThreat);

module.exports = router;
