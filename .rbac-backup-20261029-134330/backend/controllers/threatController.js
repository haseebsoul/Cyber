const mongoose = require('mongoose');
const Threat = require('../models/Threat');

// Return the newest saved threat records.
exports.getThreats = async (req, res) => {
    try {
        const threats = await Threat.find().sort({ createdAt: -1 }).limit(500);
        res.json({ threats });
    } catch (error) {
        res.status(500).json({ message: 'Failed to load threats.' });
    }
};

// Save a threat record; Admin and Analyst access is enforced in threatRoutes.js.
exports.createThreat = async (req, res) => {
    try {
        const { name, severity, sourceIp, action, details, method, path } = req.body;
        const threat = await Threat.create({ name, severity, sourceIp, action, details, method, path });
        res.status(201).json({ message: 'Threat saved.', threat });
    } catch (error) {
        res.status(400).json({ message: error.message || 'Invalid threat data.' });
    }
};

// Record a blocked/allowed/review decision for an existing threat.
exports.updateThreatAction = async (req, res) => {
    try {
        const { action } = req.body;
        if (!['Blocked', 'Allowed', 'Throttled', 'Review'].includes(action)) {
            return res.status(400).json({ message: 'Invalid threat action.' });
        }
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid threat ID.' });
        }
        const threat = await Threat.findByIdAndUpdate(req.params.id, { action }, { new: true, runValidators: true });
        if (!threat) return res.status(404).json({ message: 'Threat not found.' });
        res.json({ message: 'Threat action updated.', threat });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update threat action.' });
    }
};

// Delete a saved threat record.
exports.deleteThreat = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid threat ID.' });
        }
        const threat = await Threat.findByIdAndDelete(req.params.id);
        if (!threat) return res.status(404).json({ message: 'Threat not found.' });
        res.json({ message: 'Threat deleted.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete threat.' });
    }
};
