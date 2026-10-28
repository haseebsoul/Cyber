/**
 * authController.js
 * ---------------------------------------------------------
 * Controller functions for User Authentication (Registration & Login).
 *
 * What is a Controller in Express/MVC?
 *   The Controller contains the business logic of our application.
 *   It sits between the Routes (which receive the incoming HTTP requests)
 *   and the Model (which manages the database).
 *
 * Request Flow:
 *   Client (React / Postman) 
 *     ---> Express Route (authRoutes.js) 
 *     ---> Controller (authController.js) 
 *     ---> Model (User.js) 
 *     ---> MongoDB Atlas
 *
 * Security Principles:
 *   1. Plain-text passwords must NEVER be stored in the database.
 *   2. Passwords must be hashed using a cryptographic salt (bcryptjs).
 *   3. Passwords must NEVER be returned in any HTTP response payload.
 *   4. Sensitive errors should not leak internal database details.
 */

const User = require('../models/User');

// Safely require bcryptjs for password hashing.
// If bcryptjs is not installed yet in package.json, we capture that gracefully
// so the file can be inspected without crashing the Node process.
let bcrypt;
try {
  bcrypt = require('bcryptjs');
} catch (error) {
  bcrypt = null;
}

/**
 * ---------------------------------------------------------
 * 1. REGISTER CONTROLLER
 * ---------------------------------------------------------
 * Handles new user account creation.
 * Route: POST /api/auth/register
 *
 * Expected Request Body (JSON):
 *   {
 *     "name": "Jane Doe",
 *     "email": "jane@example.com",
 *     "password": "securePassword123",
 *     "role": "analyst" // optional, defaults to 'analyst'
 *   }
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

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

    // STEP C: Normalize email and validate format
    const normalizedEmail = email.toLowerCase().trim();
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // STEP D: Check for duplicate email (reject if user already exists)
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // STEP E: Ensure bcryptjs is available for secure password hashing
    if (!bcrypt) {
      return res.status(500).json({
        success: false,
        message: 'Server security configuration error: bcryptjs is not installed. Passwords cannot be hashed safely, and plain-text passwords will never be saved.',
      });
    }

    // STEP F: Hash the password with bcryptjs
    // A salt is random data added to the password before hashing to defend against rainbow table attacks.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // STEP G: Create and save the new user in MongoDB Atlas via the Mongoose Model
    const newUser = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword, // Store ONLY the hashed password
      role: role || 'analyst',   // Accepts 'admin', 'analyst', 'researcher' or defaults to 'analyst'
    });

    // STEP H: Return success response (201 Created)
    // SECURITY: Notice we NEVER return the password field in the response!
    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again later.',
    });
  }
};

/**
 * ---------------------------------------------------------
 * 2. LOGIN CONTROLLER
 * ---------------------------------------------------------
 * Authenticates an existing user with email and password.
 * Route: POST /api/auth/login
 *
 * Expected Request Body (JSON):
 *   {
 *     "email": "jane@example.com",
 *     "password": "securePassword123"
 *   }
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // STEP A: Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // STEP B: Normalize email and find user in database
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // If user does not exist, return 401 Unauthorized
    // Note: Use a generic error message so attackers cannot enumerate valid emails.
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // STEP C: Ensure bcryptjs is available for password verification
    if (!bcrypt) {
      return res.status(500).json({
        success: false,
        message: 'Server security configuration error: bcryptjs is not installed. Passwords cannot be verified safely.',
      });
    }

    // STEP D: Compare submitted plain-text password with stored hash
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // STEP E: Return success response (200 OK)
    // SECURITY: Return only safe user profile fields. Never expose password hash!
    // NOTE: jsonwebtoken (JWT) is not yet installed in backend/package.json.
    // If JWT is installed in the future, a signed token can be included here.
    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again later.',
    });
  }
};

module.exports = {
  register,
  login,
};
