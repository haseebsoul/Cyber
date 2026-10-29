const mongoose = require('mongoose');

// Store the latest local reputation result for each IP address.
const ipReputationSchema = new mongoose.Schema({
    ip: { type: String, required: true, unique: true, trim: true },
    riskScore: { type: Number, min: 0, max: 100, default: 0 },
    status: {
        type: String,
        enum: ['Malicious', 'Suspicious', 'Safe', 'Unknown'],
        default: 'Unknown'
    },
    category: { type: String, default: 'No recorded history' },
    country: { type: String, default: 'Unknown' },
    isp: { type: String, default: 'Unknown' },
    events: { type: Number, default: 0 },
    lookupCount: { type: Number, default: 0 },
    lastCheckedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('IPReputation', ipReputationSchema);
