const net = require('net');
const IPReputation = require('../models/IPReputation');
const Threat = require('../models/Threat');
const Event = require('../models/Event');

// Validate the IP, calculate a local score from saved records, and store the result.
exports.lookupIP = async (req, res) => {
    const ip = String(req.body.ip || '').trim();

    if (!net.isIP(ip)) {
        return res.status(400).json({ message: 'Enter a valid IPv4 or IPv6 address.' });
    }

    try {
        // Read only the fields needed from both collections.
        const [threats, events] = await Promise.all([
            Threat.find({ sourceIp: ip }).select('severity action').lean(),
            Event.find({ sourceIp: ip }).select('level action').lean()
        ]);

        // Threats use "severity" and Events use "level", so normalize both.
        const records = [
            ...threats.map((item) => ({ severity: item.severity, action: item.action })),
            ...events.map((item) => ({ severity: item.level, action: item.action }))
        ];

        const severityScores = { Low: 20, Medium: 40, High: 65, Critical: 85 };
        let riskScore = 0;
        let status = 'Unknown';

        // No history means Unknown, not Safe; otherwise score the strongest finding plus repeat activity.
        if (records.length > 0) {
            const strongest = Math.max(...records.map((item) => severityScores[item.severity] || 0));
            const repeatPoints = Math.min(15, (records.length - 1) * 3);
            const blockedPoints = Math.min(10, records.filter((item) => item.action === 'Blocked').length * 2);
            riskScore = Math.min(100, strongest + repeatPoints + blockedPoints);
            status = riskScore >= 80 ? 'Malicious' : riskScore >= 40 ? 'Suspicious' : 'Safe';
        }

        // Upsert keeps one saved result per IP and increments its lookup counter.
        const saved = await IPReputation.findOneAndUpdate(
            { ip },
            {
                $set: {
                    riskScore,
                    status,
                    category: records.length ? 'Local security history' : 'No recorded history',
                    country: 'Unknown',
                    isp: 'Unknown',
                    events: records.length,
                    lastCheckedAt: new Date()
                },
                $inc: { lookupCount: 1 }
            },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );

        res.json({ result: saved });
    } catch (error) {
        res.status(500).json({ message: 'IP reputation lookup failed.' });
    }
};
