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

module.exports = router; 