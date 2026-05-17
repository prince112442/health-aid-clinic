const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'healthaid_secret', { expiresIn: '7d' });

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, active: true });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({
      token: generateToken(user._id),
      user: { id: user._id, username: user.username, fullName: user.fullName, role: user.role, department: user.department }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// POST /api/auth/setup - Create initial admin (only if no users exist)
router.post('/setup', async (req, res) => {
  try {
    const count = await User.countDocuments();
    if (count > 0) return res.status(400).json({ message: 'Setup already completed' });
    const admin = await User.create({
      username: 'admin',
      password: 'admin123',
      fullName: 'System Administrator',
      role: 'admin',
      department: 'Administration'
    });
    res.json({ message: 'Admin created. Username: admin, Password: admin123' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
