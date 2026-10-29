
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
// 1. IMPORTS
const express = require('express'); // Brings in Express for our server
const mongoose = require('mongoose'); // Brings in Mongoose for MongoDB
const cors = require('cors'); // Brings in CORS so React can talk to us
require('dotenv').config(); // Reads the .env file and loads secrets

// 2. SETUP EXPRESS APP
const app = express();

// 3. MIDDLEWARE (Runs on EVERY request)
app.use(cors()); // Allows our React app (Port 3000) to talk to this server
app.use(express.json()); // Allows the server to understand JSON data sent from React forms

// 4. DATABASE CONNECTION
// We use process.env.MONGODB_URI to safely get the URL from the .env file
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000, // Wait 30 seconds before giving up
  socketTimeoutMS: 45000,          // Keep the connection open longer
})
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.log('❌ MongoDB Connection Error: ', err.message));

// 5. ROUTES (The URL endpoints)
// A simple health-check route. Just to see if the server is alive.
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", message: "CyberSentinel Backend is alive!" });
});

 
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

 
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// 6. START THE SERVER
// We use process.env.PORT to get the port from .env, or fallback to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
