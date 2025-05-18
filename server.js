const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');
require('dotenv').config(); // Load .env file

const app = express();

// Connect to MongoDB
connectDB();

// ✅ Middleware (must be before any routes!)
const corsOptions = {
  origin: 'http://localhost:3000', // Update with your frontend URL
  methods: 'GET,POST,PUT,PATCH,DELETE',
  credentials: true, // If you're using cookies or session-based authentication
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Optional for form submissions

// ✅ API routes (after middleware)
const authRoutes = require('./routes/auth');
const complaintsRouter = require('./routes/complaints');
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintsRouter);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files (frontend, if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Gracefully shutting down...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});
