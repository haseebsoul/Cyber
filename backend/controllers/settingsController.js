const PlatformSettings = require('../models/PlatformSettings');

const SETTINGS_ID = 'platform-settings';
const ALLOWED_FIELDS = [
    'detectionMode', 'anomalyThreshold', 'autoBlockCritical',
    'retentionDays', 'eventBatchSize', 'includeRequestBody',
    'alertSeverity', 'emailAlerts', 'notifyEmail', 'sessionTimeout',
    'requireMfa', 'allowedIpRange'
];

// Read the saved preferences, creating the default document on first use.
exports.getSettings = async (req, res) => {
    try {
        let settings = await PlatformSettings.findById(SETTINGS_ID);
        if (!settings) settings = await PlatformSettings.create({ _id: SETTINGS_ID }); // Create defaults on first use.
        res.json({ settings });
    } catch (error) {
        res.status(500).json({ message: 'Failed to load settings.' });
    }
};

// Save only recognized settings fields; Mongoose checks their types and limits.
exports.updateSettings = async (req, res) => {
    try {
        const updates = {};
        ALLOWED_FIELDS.forEach((field) => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No valid settings were provided.' });
        }

        const settings = await PlatformSettings.findByIdAndUpdate(
            SETTINGS_ID,
            { $set: updates },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );
        res.json({ message: 'Settings saved.', settings });
    } catch (error) {
        res.status(400).json({ message: error.message || 'Failed to save settings.' });
    }
};
