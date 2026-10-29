const Threat = require('../models/Threat');
const Event = require('../models/Event');

// GET /api/dashboard/stats - return real counts and recent activity.
exports.getDashboardStats = async (req, res) => {
    try {
        // Count records from MongoDB; these are all-time totals.
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const [
            threatsDetected,
            requestsBlocked,
            highSeverity,
            eventsLogged,
            hourlyCounts,
            recentEvents
        ] = await Promise.all([
            Threat.countDocuments(),
            Threat.countDocuments({ action: 'Blocked' }),
            Threat.countDocuments({ severity: { $in: ['High', 'Critical'] } }),
            Event.countDocuments(),

            // Group threat records from the last 24 hours into 2-hour UTC buckets.
            Threat.aggregate([
                { $match: { createdAt: { $gte: last24Hours } } },
                {
                    $group: {
                        _id: {
                            $multiply: [
                                { $floor: { $divide: [{ $hour: '$createdAt' }, 2] } },
                                2
                            ]
                        },
                        count: { $sum: 1 }
                    }
                },
                { $project: { hour: '$_id', count: 1, _id: 0 } },
                { $sort: { hour: 1 } }
            ]),

            // Get the newest six event records for the dashboard table.
            Event.find().sort({ createdAt: -1 }).limit(6).lean()
        ]);

        // Turn MongoDB's bucket counts into all 12 chart positions.
        const countByHour = Object.fromEntries(
            hourlyCounts.map((item) => [item.hour, item.count])
        );
        const hourlyThreats = Array.from({ length: 12 }, (_, index) => {
            const hour = index * 2;
            return {
                label: String(hour).padStart(2, '0'),
                value: countByHour[hour] || 0
            };
        });

        // Send the data the dashboard needs in one response.
        res.json({
            stats: { threatsDetected, requestsBlocked, highSeverity, eventsLogged },
            hourlyThreats,
            recentEvents
        });
    } catch (error) {
        // Keep details in the server terminal; return a simple message to the UI.
        console.error('Dashboard stats error:', error.message);
        res.status(500).json({ message: 'Failed to load dashboard statistics.' });
    }
};
