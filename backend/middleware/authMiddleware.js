const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Convert old display labels to the three backend permission roles.
function normalizeRole(role) {
    const value = String(role || '').trim().toLowerCase();
    if (value === 'administrator') return 'admin';
    if (value === 'soc analyst') return 'analyst';
    if (value === 'security researcher') return 'researcher';
    return value;
}

// Verify the JWT, reload the role from MongoDB, then check route permissions.
function protect(allowedRoles = ['admin', 'analyst', 'researcher']) {
    return async (req, res, next) => {
        const header = req.headers.authorization || '';
        if (!header.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Login token is required.' });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT_SECRET is not configured.' });
        }

        let decoded;
        try {
            decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired login token.' });
        }

        try {
            // Read the current account from the database so old tokens cannot keep old roles.
            const userId = decoded.id || decoded.userId || decoded.sub;
            const user = await User.findById(userId).select('_id name email role status');
            if (!user) return res.status(401).json({ message: 'Account no longer exists.' });
            if (user.status && user.status !== 'Active') {
                return res.status(403).json({ message: 'This account is not active.' });
            }

            const userRole = normalizeRole(user.role);
            const allowed = allowedRoles.map(normalizeRole);
            if (allowed.length && !allowed.includes(userRole)) {
                return res.status(403).json({ message: 'Your role is not allowed to perform this action.' });
            }

            req.user = { id: user._id.toString(), name: user.name, email: user.email, role: userRole };
            next();
        } catch (error) {
            console.error('Authentication middleware error:', error.message);
            return res.status(500).json({ message: 'Could not verify account permissions.' });
        }
    };
}

module.exports = { protect, normalizeRole };
