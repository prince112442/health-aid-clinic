require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthaidclinic')
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/pharmacy', require('./routes/pharmacy'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/billing', require('./routes/billing'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/vaccination', require('./routes/vaccination'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/staff', require('./routes/staff'));

// Serve frontend for all other routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/login.html'));
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🏥 Health-Aid Clinic server running on port ${PORT}`);
});

module.exports = app;
