/**
 * User.js
 * ---------------------------------------------------------
 * Mongoose Data Model for CyberSentinel-AI Users.
 *
 * What is a Schema in Mongoose?
 *   A Schema is like a blueprint or template. It defines the shape
 *   of documents inside a MongoDB collection (fields, data types,
 *   validation rules, and default values).
 *
 * What is a Model?
 *   A Model is a wrapper around the Schema. It gives us methods to
 *   Create, Read, Update, and Delete (CRUD) documents in MongoDB.
 *   Mongoose will automatically create and use a collection named "users".
 */

const mongoose = require('mongoose');

// 1. DEFINE THE USER SCHEMA
const userSchema = new mongoose.Schema(
  {
    // Full name of the user
    name: {
      type: String,
      required: [true, 'Please provide a full name'],
      trim: true, // Automatically removes accidental leading/trailing spaces
      minlength: [3, 'Name must be at least 3 characters long'],
    },

    // Email address — used for logging in
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true, // Creates a unique index in MongoDB to block duplicate registrations
      lowercase: true, // Normalizes email to lowercase (e.g. Test@Site.com -> test@site.com)
      trim: true, // Removes whitespace around the email
      match: [
        /^\S+@\S+\.\S+$/,
        'Please provide a valid email address',
      ],
    },

    // Password — SECURITY NOTE:
    // This field will store the securely HASHED password (e.g. via bcrypt).
    // Plain-text passwords must NEVER be saved to the database.
    // The hashing logic will be handled by the auth controller before save.
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },

    // Security role within the platform
    // Uses an enum (allowed list) to ensure only valid roles can be assigned
    role: {
      type: String,
      enum: {
        values: [
          'admin',
          'analyst',
          'researcher',
          'Administrator',
          'SOC Analyst',
          'Security Researcher',
        ],
        message: '{VALUE} is not a recognized role',
      },
      default: 'analyst', // Default role if none is selected
    },

    // Account status (used in Admin user management)
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Suspended'],
      default: 'Active',
    },
  },
  {
    // 2. SCHEMA OPTIONS
    // Automatically adds two fields to every document:
    //   - createdAt: when the user registered
    //   - updatedAt: when the user profile was last changed
    timestamps: true,
  }
);

// 3. COMPILE AND EXPORT THE MODEL
// 'User' tells Mongoose to manage the 'users' collection in MongoDB Atlas
const User = mongoose.model('User', userSchema);

module.exports = User;
