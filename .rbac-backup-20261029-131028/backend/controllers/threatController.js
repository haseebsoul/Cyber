const mongoose = require('mongoose');
const Threat = require('../models/Threat');

// Return the newest threat records first.
exports.getThreats = async (req, res) => {
    try {
        const threats = await Threat.find().sort({ createdAt: -1 }).limit(500);
        res.json({ threats });
    } catch (error) {
        res.status(500).json({ message: 'Failed to load threats.' });
    }
};

// Save a detected or simulated threat record.
exports.createThreat = async (req, res) => {
    try {
        const { name, severity, sourceIp, action, details, method, path } = req.body;

        const threat = await Threat.create({
            name,
            severity,
            sourceIp,
            action,
            details,
            method,
            path
        });

        res.status(201).json({ message: 'Threat saved.', threat });
    } catch (error) {
        res.status(400).json({ message: error.message || 'Invalid threat data.' });
    }
};

// Record an action for an existing threat.
// Note: setting action to "Blocked" records the decision; it is not firewall enforcement.
exports.updateThreatAction = async (req, res) => {
    try {
        const { action } = req.body;
        const allowedActions = ['Blocked', 'Allowed', 'Throttled', 'Review'];

        if (!allowedActions.includes(action)) {
            return res.status(400).json({ message: 'Invalid threat action.' });
        }

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid threat ID.' });
        }

        const threat = await Threat.findByIdAndUpdate(
            req.params.id,
            { action },
            { new: true, runValidators: true }
        );

        if (!threat) {
            return res.status(404).json({ message: 'Threat not found.' });
        }

        res.json({ message: 'Threat action updated.', threat });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update threat action.' });
    }
};
