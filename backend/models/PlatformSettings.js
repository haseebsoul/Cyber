const mongoose = require('mongoose');

// Store one shared platform-settings document with simple validation.
const settingsSchema = new mongoose.Schema({
    _id: { type: String, default: 'platform-settings' },
    detectionMode: { type: String, enum: ['alert', 'block-high', 'block-all'], default: 'block-high' },
    anomalyThreshold: { type: Number, min: 0.1, max: 1, default: 0.6 },
    autoBlockCritical: { type: Boolean, default: true },
    retentionDays: { type: Number, min: 1, max: 3650, default: 90 },
    eventBatchSize: { type: Number, min: 1, max: 10000, default: 100 },
    includeRequestBody: { type: Boolean, default: false },
    alertSeverity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'High' },
    emailAlerts: { type: Boolean, default: true },
    notifyEmail: {
        type: String,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid notification email'],
        default: 'security@cybersentinel.ai'
    },
    sessionTimeout: { type: Number, min: 1, max: 1440, default: 30 },
    requireMfa: { type: Boolean, default: false },
    allowedIpRange: { type: String, trim: true, default: '10.0.0.0/8' }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('PlatformSettings', settingsSchema);
