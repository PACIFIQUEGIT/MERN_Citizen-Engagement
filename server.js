const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('./db');
require('dotenv').config(); // Load environment variables

const app = express();

// 🔌 Connect to MongoDB
connectDB();

// 🔧 Middleware
const corsOptions = {
  origin: '*', // ✅ Change to specific origin (e.g., https://yourfrontend.com) in production
  methods: 'GET,POST,PUT,PATCH,DELETE',
  credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🖼 Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 🧾 Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// 🔐 API routes
const authRoutes = require('./routes/auth');
const complaintsRouter = require('./routes/complaints');
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintsRouter);

// 🧭 EJS page routes (convert your HTML files into EJS)
app.get('/', (req, res) => {
  res.render('citizen'); // from citizen.ejs
});

app.get('/admin', (req, res) => {
  res.render('admin'); // from admin.ejs
});

app.get('/admin-signup', (req, res) => {
  res.render('admin-signup'); // from admin-signup.ejs
});

app.get('/tracking', (req, res) => {
  res.render('tracking'); // from tracking.ejs
});

// ❌ 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// 🚀 Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));

// 🧹 Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Gracefully shutting down...');
  mongoose.connection.close(() => {
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  });
});
