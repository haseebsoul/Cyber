
const mongoose = require('mongoose');

const threatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        required: true
    },
    sourceIp: {
        type: String,
        required: true,
        trim: true
    },
    action: {
        type: String,
        enum: ['Blocked', 'Allowed', 'Throttled', 'Review'],
        default: 'Review'
    },
    details: {
        type: String,
        trim: true,
        default: ''
    },
    method: {
        type: String,
        trim: true,
        default: ''
    },
    path: {
        type: String,
        trim: true,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Threat', threatSchema);
