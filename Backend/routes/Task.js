const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

// Set up multer storage for PDF/Word files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and Word files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Assign a new task to an intern with file upload
router.post("/assign", upload.single("file"), async (req, res) => {
  try {
    const { title,description, deadline, assignedDate, assignedTo } = req.body;
    let filePath = req.file ? req.file.path : undefined;

    // Find the user by email or id
    let user = null;
    if (assignedTo.includes("@")) {
      user = await User.findOne({ email: assignedTo, role: "intern" });
    } else {
      user = await User.findOne({ _id: assignedTo, role: "intern" });
    }
    if (!user) {
      return res.status(404).json({ message: "Intern not found" });
    }

    const task = new Task({
      title,
      description,
      deadline,
      assignedDate: assignedDate || Date.now(),
      file: filePath,
      assignedTo: user._id,
      status: "Ongoing",
    });
    await task.save();
    res.status(201).json({ message: "Task assigned successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error assigning task", error: error.message });
  }
});

// Get all assigned tasks with user name and formatted dates, and update status if deadline passed
// Get all assigned tasks with user name and formatted dates, and update status if deadline passed
router.get("/assigned", async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");
    const now = new Date();
    for (const task of tasks) {
      if (task.status === 'Ongoing' && task.deadline && new Date(task.deadline) < now) {
        task.status = 'Pending';
        await task.save();
      }
    }
    // Format the response - KEEP THE FULL DATETIME, DON'T SLICE IT
    const formattedTasks = tasks.map(task => ({
      _id: task._id,
      title: task.title,
      description: task.description,
      deadline: task.deadline ? task.deadline.toISOString() : '', // Keep full datetime
      assignedDate: task.assignedDate ? task.assignedDate.toISOString().slice(0, 10) : '', // Only date for assignedDate is fine
      file: task.file,
      status: task.status,
      assignedTo: task.assignedTo ? {
        _id: task.assignedTo._id,
        name: task.assignedTo.name,
        email: task.assignedTo.email
      } : null
    }));
    res.status(200).json(formattedTasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
});

// Delete a task by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

router.patch('/update-status/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Status updated', task });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
});

// TEMPORARY: Add admin progress routes here since the separate Progress.js isn't working
router.get('/admin-progress-test', async (req, res) => {
  console.log('✅ Admin progress test route working!');
  res.json({ 
    success: true, 
    message: 'Admin Progress API is working!', 
    timestamp: new Date().toISOString() 
  });
});

router.get('/admin-progress', async (req, res) => {
  try {
    console.log('✅ Fetching admin progress data...');
    
    // Get all users with intern role
    const interns = await User.find({ role: 'intern' }).select('name email role createdAt');
    console.log(`Found ${interns.length} interns`);
    
    if (interns.length === 0) {
      return res.status(200).json([]);
    }

    const detailedInternProgress = await Promise.all(interns.map(async (intern) => {
      try {
        // Get all tasks for this intern
        const tasks = await Task.find({ assignedTo: intern._id }).sort({ assignedDate: -1 });
        
        const ongoingTasks = tasks.filter(task => task.status === 'Ongoing');
        const completedTasks = tasks.filter(task => task.status === 'Completed');
        const pendingTasks = tasks.filter(task => task.status === 'Pending');

        // Calculate additional metrics
        const now = new Date();
        const overdueTasks = tasks.filter(task => {
          const deadline = new Date(task.deadline);
          return deadline < now && task.status !== 'Completed';
        });

        // Calculate productivity score (0-100)
        const totalTasks = tasks.length;
        const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;
        const onTimeRate = totalTasks > 0 ? ((totalTasks - overdueTasks.length) / totalTasks) * 100 : 100;
        const productivityScore = Math.round((completionRate * 0.6) + (onTimeRate * 0.4));

        // Get recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentTasks = tasks.filter(task => new Date(task.assignedDate) >= thirtyDaysAgo);

        return {
          _id: intern._id,
          userId: {
            _id: intern._id,
            name: intern.name,
            email: intern.email,
            role: intern.role,
            joinedAt: intern.createdAt
          },
          courses: [],
          roadmaps: [],
          achievements: [],
          totalCoursesCompleted: 0,
          totalRoadmapsCompleted: 0,
          totalTimeSpent: 0,
          tasks: {
            ongoing: ongoingTasks,
            completed: completedTasks,
            pending: pendingTasks,
            overdue: overdueTasks,
            total: tasks.length,
            recent: recentTasks
          },
          metrics: {
            completionRate: completionRate.toFixed(1),
            onTimeRate: onTimeRate.toFixed(1),
            productivityScore,
            avgCompletionTime: 0,
            tasksThisMonth: recentTasks.length,
            completedThisMonth: recentTasks.filter(task => task.status === 'Completed').length
          }
        };
      } catch (internError) {
        console.error(`Error processing intern ${intern.name}:`, internError);
        return {
          _id: intern._id,
          userId: {
            _id: intern._id,
            name: intern.name,
            email: intern.email,
            role: intern.role,
            joinedAt: intern.createdAt
          },
          courses: [],
          roadmaps: [],
          achievements: [],
          totalCoursesCompleted: 0,
          totalRoadmapsCompleted: 0,
          totalTimeSpent: 0,
          tasks: {
            ongoing: [],
            completed: [],
            pending: [],
            overdue: [],
            total: 0,
            recent: []
          },
          metrics: {
            completionRate: '0',
            onTimeRate: '100',
            productivityScore: 0,
            avgCompletionTime: 0,
            tasksThisMonth: 0,
            completedThisMonth: 0
          }
        };
      }
    }));

    // Sort by productivity score (highest first)
    detailedInternProgress.sort((a, b) => b.metrics.productivityScore - a.metrics.productivityScore);

    console.log(`Returning progress data for ${detailedInternProgress.length} interns`);
    res.status(200).json(detailedInternProgress);
  } catch (error) {
    console.error('Error fetching intern progress:', error);
    res.status(500).json({ 
      message: 'Error fetching intern progress', 
      error: error.message
    });
  }
});

// TEMPORARY: Add notification routes here since the separate Notification.js might not be loading
router.post('/send-notification', async (req, res) => {
  try {
    console.log('✅ Send notification route hit!');
    const { recipientId, subject, message } = req.body;
    
    // For now, just return success - we'll implement full notification later
    res.json({ 
      success: true, 
      message: 'Notification sent successfully (mock)',
      data: { recipientId, subject, message }
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ message: 'Failed to send notification', error: error.message });
  }
});

router.post('/send-message', async (req, res) => {
  try {
    console.log('✅ Send message route hit!');
    const { recipientId, subject, message } = req.body;
    
    // For now, just return success - we'll implement full notification later
    res.json({ 
      success: true, 
      message: 'Message sent successfully (mock)',
      data: { recipientId, subject, message }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
});

module.exports = router; 