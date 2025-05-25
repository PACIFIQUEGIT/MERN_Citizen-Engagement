const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Make sure the path is correct

const router = express.Router();

// Admin sign-up
router.post('/signup', async (req, res) => {
  const { name, email, password, institution } = req.body;

  if (!name || !email || !password || !institution) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!['Health', 'Education', 'Sport'].includes(institution)) {
    return res.status(400).json({ message: 'Invalid institution value.' });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password_hash: hashedPassword,
      institution
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully!' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Ensure admin is fetched from the database
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Ensure institution is available and is a valid enum value
    if (!admin.institution) {
      return res.status(400).json({ message: 'Invalid institution information' });
    }

    // Generate token after successful login
    const token = jwt.sign(
    { adminId: admin._id, institution: admin.institution, adminEmail: admin.email, isAdmin: true },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '24h' }
    );


    // Send the generated token back to the client
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const path = require('path');

// Serve React build files in production
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all handler to serve index.html for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


module.exports = router;
