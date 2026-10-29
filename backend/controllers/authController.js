const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeToken(user) {
    // The token identifies the account; permissions are re-read from MongoDB by middleware.
    return jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '8h' });
}

function safeUser(user) {
    return {
        id: user._id.toString(),
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
    };
}

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required.' });
        }
        if (name.trim().length < 3 || password.length < 6) {
            return res.status(400).json({ message: 'Name must be at least 3 characters and password at least 6 characters.' });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT_SECRET is not configured.' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
            return res.status(400).json({ message: 'Please enter a valid email address.' });
        }
        if (await User.findOne({ email: normalizedEmail })) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }

        // Public sign-up cannot assign admin/analyst permissions; Admin assigns elevated roles later.
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({
            name: name.trim(), email: normalizedEmail, password: passwordHash, role: 'researcher'
        });
        const token = makeToken(user);
        return res.status(201).json({ message: 'Account created.', token, user: safeUser(user) });
    } catch (error) {
        console.error('Registration error:', error.message);
        return res.status(500).json({ message: 'Registration failed.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT_SECRET is not configured.' });
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        if (user.status && user.status !== 'Active') {
            return res.status(403).json({ message: 'This account is not active.' });
        }

        // The token is signed with the account ID; frontend role choices are never trusted.
        return res.json({ message: 'Login successful.', token: makeToken(user), user: safeUser(user) });
    } catch (error) {
        console.error('Login error:', error.message);
        return res.status(500).json({ message: 'Login failed.' });
    }
};
