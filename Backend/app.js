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
  res.send("Backend is working!");
});

// Import routes
console.log('Importing routes...');
try {
  const authRoutes = require('./routes/Auth');
  const taskRoutes = require('./routes/Task');
  const internProfileRoutes = require('./routes/InternProfile');
  const courseRoutes = require('./routes/Course');
  const userProgressRoutes = require('./routes/UserProgress');
  const progressRoutes = require('./routes/Progress');
  const resourceRoutes = require('./routes/Resource');
  const notificationRoutes = require('./routes/Notification');

  console.log('All routes imported successfully');

  console.log('Mounting routes...');

  // Mount routes correctly
  app.use('/api/auth', authRoutes);
  app.use('/api/task', taskRoutes);
  app.use('/api/intern-profile', internProfileRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/progress', userProgressRoutes);
  app.use('/api/admin-progress', progressRoutes);
  app.use('/api/resources', resourceRoutes);
  app.use('/api/notifications', notificationRoutes);

  console.log('Routes mounted successfully!');
  console.log('Available routes:');
  console.log('- /api/auth');
  console.log('- /api/task');
  console.log('- /api/intern-profile');
  console.log('- /api/courses');
  console.log('- /api/progress');
  console.log('- /api/admin-progress');
  console.log('- /api/resources');
  console.log('- /api/notifications');

} catch (error) {
  console.error('❌ Error importing or mounting routes:', error);
}

//download file
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Catch-all route for debugging
app.use('*', (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    url: req.originalUrl,
    availableRoutes: [
      '/api/auth',
      '/api/task', 
      '/api/intern-profile',
      '/api/courses',
      '/api/progress',
      '/api/admin-progress',
      '/api/resources'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Admin Progress API: http://localhost:${PORT}/api/admin-progress`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/admin-progress/test`);
});