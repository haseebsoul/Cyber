/**
 * userController.js
 * ---------------------------------------------------------
 * Controller functions for User CRUD operations (Admin Workspace).
 *
 * Architecture (MVC):
 *   Routes (userRoutes.js) ---> Controller (userController.js) ---> Model (User.js) ---> MongoDB Atlas
 *
 * Responsibilities:
 *   1. getUsers   — List all registered users (passwords excluded).
 *   2. createUser — Add a new user with a hashed password (passwords excluded from response).
 *   3. updateUser — Update user profile details (name, email, role, status).
 *   4. deleteUser — Remove a user record by their MongoDB ObjectId.
 *
 * Security Principles:
 *   - NEVER return password hashes in responses.
 *   - Validate MongoDB IDs before querying to prevent invalid cast errors.
 *   - Check for duplicate emails on create and update.
 *   - Require a dedicated password on creation and hash it via bcryptjs.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Allowed roles and statuses based on backend/models/User.js schema
const ALLOWED_ROLES = [
  'admin',
  'analyst',
  'researcher',
  'Administrator',
  'SOC Analyst',
  'Security Researcher',
];

const ALLOWED_STATUSES = ['Active', 'Inactive', 'Suspended'];

/**
 * ---------------------------------------------------------
 * 1. GET ALL USERS
 * ---------------------------------------------------------
 * Endpoint: GET /api/users
 * Returns list of users sorted by creation date (newest first).
 * Excludes password hashes using Mongoose .select('-password').
 */
const getUsers = async (req, res) => {
  try {
    // .select('-password') guarantees that password hashes are NEVER returned
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Get Users Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving users.',
    });
  }
};

/**
 * ---------------------------------------------------------
 * 2. CREATE A NEW USER (Admin)
 * ---------------------------------------------------------
 * Endpoint: POST /api/users
 * Expected Body (JSON):
 *   {
 *     "name": "Alex Taylor",
 *     "email": "alex@example.com",
 *     "password": "Password123",
 *     "role": "SOC Analyst", // optional, defaults to 'SOC Analyst'
 *     "status": "Active"      // optional, defaults to 'Active'
 *   }
 */
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;

    // STEP A: Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and password.',
      });
    }

    // STEP B: Validate name and password length
    const trimmedName = name.trim();
    if (trimmedName.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 3 characters long.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // STEP C: Normalize and validate email format
    const normalizedEmail = email.toLowerCase().trim();
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // STEP D: Validate role and status if provided
    const userRole = role || 'SOC Analyst';
    if (!ALLOWED_ROLES.includes(userRole)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role specified. Allowed values: ${ALLOWED_ROLES.join(', ')}`,
      });
    }

    const userStatus = status || 'Active';
    if (!ALLOWED_STATUSES.includes(userStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status specified. Allowed values: ${ALLOWED_STATUSES.join(', ')}`,
      });
    }

    // STEP E: Check for duplicate email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // STEP F: Hash password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // STEP G: Save to MongoDB Atlas
    const newUser = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: userRole,
      status: userStatus,
    });

    // STEP H: Return sanitized user object (passwords excluded)
    return res.status(201).json({
      success: true,
      message: 'User created successfully.',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    });
  } catch (error) {
    console.error('Create User Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating user.',
    });
  }
};

/**
 * ---------------------------------------------------------
 * 3. UPDATE AN EXISTING USER
 * ---------------------------------------------------------
 * Endpoint: PUT /api/users/:id
 * Expected Body (JSON): { name, email, role, status }
 * Note: Password updates are intentionally excluded from this endpoint.
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status } = req.body;

    // STEP A: Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format.',
      });
    }

    // STEP B: Find user by ID in MongoDB
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // STEP C: Validate updated name if provided
    if (name !== undefined) {
      const trimmedName = name.trim();
      if (trimmedName.length < 3) {
        return res.status(400).json({
          success: false,
          message: 'Name must be at least 3 characters long.',
        });
      }
      user.name = trimmedName;
    }

    // STEP D: Validate updated email and check for conflicts
    if (email !== undefined) {
      const normalizedEmail = email.toLowerCase().trim();
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address.',
        });
      }

      // Check if another user already owns this email address
      if (normalizedEmail !== user.email) {
        const duplicate = await User.findOne({
          email: normalizedEmail,
          _id: { $ne: user._id },
        });
        if (duplicate) {
          return res.status(409).json({
            success: false,
            message: 'An account with this email address already exists.',
          });
        }
        user.email = normalizedEmail;
      }
    }

    // STEP E: Validate updated role if provided
    if (role !== undefined) {
      if (!ALLOWED_ROLES.includes(role)) {
        return res.status(400).json({
          success: false,
          message: `Invalid role specified. Allowed values: ${ALLOWED_ROLES.join(', ')}`,
        });
      }
      user.role = role;
    }

    // STEP F: Validate updated status if provided
    if (status !== undefined) {
      if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status specified. Allowed values: ${ALLOWED_STATUSES.join(', ')}`,
        });
      }
      user.status = status;
    }

    // STEP G: Save updated document
    const updatedUser = await user.save();

    // STEP H: Return sanitized user object
    return res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update User Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating user.',
    });
  }
};

/**
 * ---------------------------------------------------------
 * 4. DELETE A USER
 * ---------------------------------------------------------
 * Endpoint: DELETE /api/users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // STEP A: Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format.',
      });
    }

    // STEP B: Find and delete document
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // STEP C: Return confirmation
    return res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
      user: {
        _id: deletedUser._id,
        name: deletedUser.name,
        email: deletedUser.email,
      },
    });
  } catch (error) {
    console.error('Delete User Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting user.',
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
