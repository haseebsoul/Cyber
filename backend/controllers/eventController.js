const Event = require('../models/Event');

// Get the newest events first.
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 }).limit(500);
        res.json({ events });
    } catch (error) {
        res.status(500).json({ message: 'Failed to load events.' });
    }
};

// Save a security event.
exports.createEvent = async (req, res) => {
    try {
        const { name, level, sourceIp, action, details, method, path } = req.body;

        const event = await Event.create({
            name,
            level,
            sourceIp,
            action,
            details,
            method,
            path
        });

        res.status(201).json({ message: 'Event saved.', event });
    } catch (error) {
        res.status(400).json({ message: error.message || 'Invalid event data.' });
    }
};
