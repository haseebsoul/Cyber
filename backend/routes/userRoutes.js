/**
 * userRoutes.js
 * ---------------------------------------------------------
 * User Management Routes for CyberSentinel-AI (Admin CRUD).
 *
 * Architecture (MVC):
 *   Express Router groups user endpoints and maps them to userController.js:
 *     - GET    /api/users      ---> getUsers
 *     - POST   /api/users      ---> createUser
 *     - PUT    /api/users/:id  ---> updateUser
 *     - DELETE /api/users/:id  ---> deleteUser
 */

const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

// 1. LIST ALL USERS & CREATE NEW USER
// GET  /api/users -> List all users (excluding passwords)
// POST /api/users -> Create user with hashed password
router.get('/', getUsers);
router.post('/', createUser);

// 2. UPDATE & DELETE USER BY ID
// PUT    /api/users/:id -> Update user details (name, email, role, status)
// DELETE /api/users/:id -> Delete user by ID
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
