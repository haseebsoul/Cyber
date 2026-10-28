/**
 * authRoutes.js
 * ---------------------------------------------------------
 * Authentication Routes for CyberSentinel-AI.
 *
 * What is an Express Router?
 *   Express Router is a mini-application capable of handling middleware
 *   and routing. It allows us to group related endpoints (like auth)
 *   into dedicated modules instead of cluttering server.js.
 *
 * How this connects:
 *   1. server.js mounts this router:
 *        const authRoutes = require('./routes/authRoutes');
 *        app.use('/api/auth', authRoutes);
 *   2. When an HTTP request matches:
 *        POST /api/auth/register -> executes authController.register
 *        POST /api/auth/login    -> executes authController.login
 *   3. The controller processes the request, interacts with the User model,
 *      and returns a clear JSON response and HTTP status code.
 */

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// 1. REGISTRATION ROUTE
// Endpoint: POST /api/auth/register
// Accepts: { name, email, password, role }
router.post('/register', register);

// 2. LOGIN ROUTE
// Endpoint: POST /api/auth/login
// Accepts: { email, password }
router.post('/login', login);

module.exports = router;
