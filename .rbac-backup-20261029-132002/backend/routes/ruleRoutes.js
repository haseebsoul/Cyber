const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getRules, createRule, updateRule, deleteRule } = require('../controllers/ruleController');

// Everyone with a valid role can view rules; only Admin/Analyst can change them.
router.get('/', protect(['admin', 'analyst', 'researcher']), getRules);
router.post('/', protect(['admin', 'analyst']), createRule);
router.put('/:id', protect(['admin', 'analyst']), updateRule);
router.delete('/:id', protect(['admin', 'analyst']), deleteRule);

module.exports = router;
