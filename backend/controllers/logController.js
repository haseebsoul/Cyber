const { getUnifiedLogs } = require('../models/UnifiedLog');

// Return events and threats in one chronological list for the Logs page.
exports.getLogs = async (req, res) => {
    try {
        const records = await getUnifiedLogs();

        const logs = records.map((record) => {
            // Convert saved severity/action into the badge levels used by Logs.jsx.
            let level = 'info';
            if (record.action === 'Blocked') level = 'block';
            else if (record.severity === 'Critical') level = 'crit';
            else if (record.severity === 'High' || record.severity === 'Medium' || record.action === 'Throttled') level = 'warn';
            else if (record.action === 'Allowed') level = 'ok';

            const extra = [record.method, record.path].filter(Boolean).join(' ');
            const text = `${record.source} · ${record.name} · ${record.action} · src ${record.sourceIp}${extra ? ` · ${extra}` : ''}${record.details ? ` · ${record.details}` : ''}`;
            return { ...record, level, text };
        });

        res.json({ logs });
    } catch (error) {
        res.status(500).json({ message: 'Failed to load security logs.' });
    }
};
