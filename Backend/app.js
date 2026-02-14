const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Enhanced Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers));
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Sample route
app.get("/", (req, res) => {
  res.json({
    message: "Backend is working!",
    timestamp: new Date().toISOString(),
    routes: [
      '/api/auth/users',
      '/api/task/assigned',
      '/api/analytics/dashboard',
      '/api/analytics/task-trends',
      '/api/analytics/notifications',
      '/api/analytics/internees',
      '/api/analytics/courses',
      '/api/analytics/performance-trends',
      '/api/analytics/task-distribution',
      '/api/settings'
    ]
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Import routes
const authRoutes = require('./routes/Auth');
const taskRoutes = require('./routes/Task');
const internProfileRoutes = require('./routes/InternProfile');
const courseRoutes = require('./routes/Course');
const userProgressRoutes = require('./routes/UserProgress');
const analyticsRoutes = require('./routes/Analytics');
const notificationRoutes = require('./routes/Notification');
const communicationRoutes = require('./routes/Communication');
const settingRoutes = require('./routes/Setting');

// Mount routes correctly - the route file already has '/register'
app.use('/api/auth', authRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/intern-profile', internProfileRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', userProgressRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/communications', communicationRoutes);
app.use('/api/settings', settingRoutes);

//download file
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Catch-all for 404
app.use((req, res, next) => {
  console.log(`404 ALERT: Request for ${req.url} returned 404`);
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.url} not found on this server`,
    path: req.url
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log('====================================');
  console.log(`SERVER STARTED ON PORT: ${PORT}`);
  console.log(`ROOT DIR: ${process.cwd()}`);
  console.log(`APP FILE: ${__filename}`);
  console.log('====================================');
});