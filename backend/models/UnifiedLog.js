// Combine existing Event and Threat records; no duplicate logs collection is needed.
const Event = require('./Event');
const Threat = require('./Threat');

exports.getUnifiedLogs = async () => {
    // Read the newest saved records from both collections.
    const [events, threats] = await Promise.all([
        Event.find().sort({ createdAt: -1 }).limit(500).lean(),
        Threat.find().sort({ createdAt: -1 }).limit(500).lean()
    ]);

    // Convert both schemas into one shared log shape.
    const eventLogs = events.map((event) => ({
        id: `event-${event._id}`,
        source: 'EVENT',
        timestamp: event.createdAt || event.updatedAt,
        name: event.name,
        severity: event.level || 'Low',
        sourceIp: event.sourceIp || 'Unknown',
        action: event.action || 'Review',
        details: event.details || '',
        method: event.method || '',
        path: event.path || ''
    }));

    const threatLogs = threats.map((threat) => ({
        id: `threat-${threat._id}`,
        source: 'THREAT',
        timestamp: threat.createdAt || threat.updatedAt,
        name: threat.name,
        severity: threat.severity || 'Low',
        sourceIp: threat.sourceIp || 'Unknown',
        action: threat.action || 'Review',
        details: threat.details || '',
        method: threat.method || '',
        path: threat.path || ''
    }));

    // Sort the combined list newest first and limit its size.
    return [...eventLogs, ...threatLogs]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 500);
};
