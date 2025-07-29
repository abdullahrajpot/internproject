const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middleware/auth"); // Added authenticateToken middleware

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password,role } = req.body;
  
  // Add validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  
  // Check if JWT_SECRET exists
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables");
    return res.status(500).json({ message: "Server configuration error" });
  }
  
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role: role || "user" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id,role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role:user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

// Delete a user by ID
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});

// Update a user's role by ID
router.patch("/users/:id/role", async (req, res) => {
  const { role } = req.body;
  if (!role) return res.status(400).json({ message: "Role is required" });
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Role updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating role", error: error.message });
  }
});

// Update profile (name and/or email only, no file upload)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    const user = await User.findByIdAndUpdate(userId, update, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Profile update failed', error: error.message });
  }
});

module.exports = router;