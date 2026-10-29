
// const dns = require('dns');
// dns.setServers(['8.8.8.8', '8.8.4.4']);
// // 1. IMPORTS
// const express = require('express'); // Brings in Express for our server
// const mongoose = require('mongoose'); // Brings in Mongoose for MongoDB
// const cors = require('cors'); // Brings in CORS so React can talk to us
// require('dotenv').config(); // Reads the .env file and loads secrets

// // 2. SETUP EXPRESS APP
// const app = express();

// // 3. MIDDLEWARE (Runs on EVERY request)
// app.use(cors()); // Allows our React app (Port 3000) to talk to this server
// app.use(express.json()); // Allows the server to understand JSON data sent from React forms

// // 4. DATABASE CONNECTION
// // We use process.env.MONGODB_URI to safely get the URL from the .env file
// mongoose.connect(process.env.MONGODB_URI, {
//   serverSelectionTimeoutMS: 30000, // Wait 30 seconds before giving up
//   socketTimeoutMS: 45000,          // Keep the connection open longer
// })
//   .then(() => console.log('âœ… MongoDB Connected Successfully'))
//   .catch((err) => console.log('âŒ MongoDB Connection Error: ', err.message));

// // 5. ROUTES (The URL endpoints)
// // A simple health-check route. Just to see if the server is alive.
// app.get('/api/health', (req, res) => {
//   res.json({ status: "ok", message: "CyberSentinel Backend is alive!" });
// });

 
// const authRoutes = require('./routes/authRoutes');
// app.use('/api/auth', authRoutes);

 
// const userRoutes = require('./routes/userRoutes');
// app.use('/api/users', userRoutes);
// // Rules Management Routes
// const ruleRoutes = require('./routes/ruleRoutes');
// app.use('/api/rules', ruleRoutes);
// // Threat Management Routes
// const threatRoutes = require('./routes/threatRoutes');
// app.use('/api/threats', threatRoutes);
// // event management routes
// const eventRoutes = require('./routes/eventRoutes');
// app.use('/api/events', eventRoutes);
// // Connect the dashboard endpoint.
// const dashboardRoutes = require('./routes/dashboardRoutes');
// app.use('/api/dashboard', dashboardRoutes);
// // Connect the IP reputation API.
// const ipReputationRoutes = require('./routes/ipReputationRoutes');
// app.use('/api/ip-reputation', ipReputationRoutes);

// // 6. START THE SERVER
// // We use process.env.PORT to get the port from .env, or fallback to 5000
// const logRoutes = require('./routes/logRoutes');
// app.use('/api/logs', logRoutes);

// const settingsRoutes = require('./routes/settingsRoutes');
// app.use('/api/settings', settingsRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`âœ… Server running on http://localhost:${PORT}`);
// });


require('dotenv').config();

const dns = require('node:dns');
dns.setServers(['10.160.45.18']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Check backend and database status
app.get('/api/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;

  res.status(200).json({
    status: 'ok',
    database: connected ? 'connected' : 'not connected',
    databaseState: mongoose.connection.readyState
  });
});

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/rules', require('./routes/ruleRoutes'));
app.use('/api/threats', require('./routes/threatRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/ip-reputation', require('./routes/ipReputationRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[SUCCESS] Server running on http://localhost:${PORT}`);
});

// Connect to MongoDB Atlas
async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    console.error('[ERROR] MONGODB_URI is missing from backend/.env');
    return;
  }

  console.log('[INFO] Connecting to MongoDB Atlas...');

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000
    });

    console.log('[SUCCESS] MongoDB connected successfully.');
  } catch (error) {
    console.error(`[ERROR] MongoDB connection failed: ${error.message}`);
    console.error('[INFO] Check DNS, internet, Atlas access, and backend/.env.');
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('[WARN] MongoDB connection disconnected.');
});

connectDatabase();
