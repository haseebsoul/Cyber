const express = require('express');
const router = express.Router();

const {
    getThreats,
    createThreat,
    updateThreatAction
} = require('../controllers/threatController');

router.get('/', getThreats);
router.post('/', createThreat);
router.put('/:id', updateThreatAction);

module.exports = router;
