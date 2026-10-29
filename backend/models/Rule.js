const mongoose = require('mongoose');
// TO DEFINE HOW SECURITY RULES ARE STORED IN MONGODB, WE CREATE A MONGOOSE SCHEMA
const ruleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    pattern: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['Injection', 'XSS', 'Traversal', 'Command', 'Rate'],
        required: true
    },
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        required: true
    },
    enabled: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Rule', ruleSchema);
