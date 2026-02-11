const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

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
      '/api/analytics/task-distribution'
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

// Mount routes correctly - the route file already has '/register'
app.use('/api/auth', authRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/intern-profile', internProfileRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', userProgressRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

//download file
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});