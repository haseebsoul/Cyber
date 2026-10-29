const Rule = require('../models/Rule');

// Get all rules
exports.getRules = async (req, res) => {
    try {
        const rules = await Rule.find().sort({ createdAt: 1 });
        res.json({ rules });
    } catch (error) {
        res.status(500).json({ message: 'Failed to load rules.' });
    }
};

// Add a rule
exports.createRule = async (req, res) => {
    try {
        const { name, pattern, category, severity, enabled } = req.body;

        const rule = await Rule.create({
            name, pattern, category, severity, enabled
        });

        res.status(201).json({ message: 'Rule created.', rule });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Edit or enable/disable a rule
exports.updateRule = async (req, res) => {
    try {
        const updates = {};
        const allowedFields = [
            'name', 'pattern', 'category', 'severity', 'enabled'
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const rule = await Rule.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!rule) {
            return res.status(404).json({ message: 'Rule not found.' });
        }

        res.json({ message: 'Rule updated.', rule });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a rule
exports.deleteRule = async (req, res) => {
    try {
        const rule = await Rule.findByIdAndDelete(req.params.id);

        if (!rule) {
            return res.status(404).json({ message: 'Rule not found.' });
        }

        res.json({ message: 'Rule deleted.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
