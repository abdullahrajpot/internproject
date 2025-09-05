const express = require("express");
const router = express.Router();
const InternProfile = require("../models/InternProfile");
const User = require("../models/User");
const { authenticateToken: auth } = require("../middleware/auth");
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profile-pictures/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// @route   GET /api/intern-profile
// @desc    Get current user's intern profile
// @access  Private (Intern only)
router.get("/", auth, async (req, res) => {
    try {
        // Check if user is an intern
        const user = await User.findById(req.user.id);
        if (user.role !== "intern") {
            return res.status(403).json({ message: "Access denied. Intern role required." });
        }

        const profile = await InternProfile.findOne({ userId: req.user.id }).populate("userId", "name email");

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   POST /api/intern-profile
// @desc    Create or update intern profile
// @access  Private (Intern only)
router.post("/", auth, async (req, res) => {
    try {
        // Check if user is an intern
        const user = await User.findById(req.user.id);
        if (user.role !== "intern") {
            return res.status(403).json({ message: "Access denied. Intern role required." });
        }

        const {
            fullName,
            dateOfBirth,
            gender,
            phoneNumber,
            alternatePhone,
            address,
            education,
            experience,
            internshipDetails,
            bio,
            socialLinks,
            visibility
        } = req.body;

        // Check if profile already exists
        let profile = await InternProfile.findOne({ userId: req.user.id });

        if (profile) {
            // Update existing profile
            profile = await InternProfile.findOneAndUpdate(
                { userId: req.user.id },
                {
                    fullName,
                    dateOfBirth,
                    gender,
                    phoneNumber,
                    alternatePhone,
                    address,
                    education,
                    experience,
                    internshipDetails,
                    bio,
                    socialLinks,
                    visibility,
                    updatedAt: Date.now()
                },
                { new: true, runValidators: true }
            );
        } else {
            // Create new profile
            profile = new InternProfile({
                userId: req.user.id,
                fullName,
                dateOfBirth,
                gender,
                phoneNumber,
                alternatePhone,
                address,
                education,
                experience,
                internshipDetails,
                bio,
                socialLinks,
                visibility
            });

            await profile.save();
        }

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   POST /api/intern-profile/upload-picture
// @desc    Upload profile picture
// @access  Private (Intern only)
router.post("/upload-picture", auth, upload.single('profilePicture'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== "intern") {
            return res.status(403).json({ message: "Access denied. Intern role required." });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const profilePictureUrl = `/uploads/profile-pictures/${req.file.filename}`;

        const profile = await InternProfile.findOneAndUpdate(
            { userId: req.user.id },
            { profilePicture: profilePictureUrl, updatedAt: Date.now() },
            { new: true, runValidators: true, upsert: true }
        );

        res.json({
            message: "Profile picture uploaded successfully",
            profilePicture: profilePictureUrl,
            profile: profile
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   PUT /api/intern-profile/personal
// @desc    Update personal information only
// @access  Private (Intern only)
router.put("/personal", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== "intern") {
            return res.status(403).json({ message: "Access denied. Intern role required." });
        }

        const { fullName, dateOfBirth, gender, phoneNumber, alternatePhone, bio } = req.body;

        const profile = await InternProfile.findOneAndUpdate(
            { userId: req.user.id },
            {
                fullName,
                dateOfBirth,
                gender,
                phoneNumber,
                alternatePhone,
                bio,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   PUT /api/intern-profile/address
// @desc    Update address information
// @access  Private (Intern only)
router.put("/address", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== "intern") {
            return res.status(403).json({ message: "Access denied. Intern role required." });
        }

        const { address } = req.body;

        const profile = await InternProfile.findOneAndUpdate(
            { userId: req.user.id },
            { address, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   PUT /api/intern-profile/education
// @desc    Update education information
// @access  Private (Intern only)
router.put("/education", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== "intern") {
            return res.status(403).json({ message: "Access denied. Intern role required." });
        }

        const { education } = req.body;

        const profile = await InternProfile.findOneAndUpdate(
            { userId: req.user.id },
            { education, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   POST /api/intern-profile/achievement
// @desc    Add new achievement
// @access  Private (Intern only)
router.post("/achievement", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== "intern") {
            return res.status(403).json({ message: "Access denied. Intern role required." });
        }

        const { title, description, icon } = req.body;

        const profile = await InternProfile.findOne({ userId: req.user.id });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        profile.achievements.push({
            title,
            description,
            icon,
            dateEarned: new Date()
        });

        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   PUT /api/intern-profile/progress
// @desc    Update course progress
// @access  Private (Intern only)
router.put("/progress", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== "intern") {
            return res.status(403).json({ message: "Access denied. Intern role required." });
        }

        const { coursesInProgress, coursesCompleted } = req.body;

        const profile = await InternProfile.findOneAndUpdate(
            { userId: req.user.id },
            {
                "internshipDetails.coursesInProgress": coursesInProgress,
                "internshipDetails.coursesCompleted": coursesCompleted,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   DELETE /api/intern-profile/delete-account
// @desc    Delete user account and profile
// @access  Private (Intern only)
router.delete("/delete-account", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== "intern") {
            return res.status(403).json({ message: "Access denied. Intern role required." });
        }

        const { confirmPassword } = req.body;

        // Verify password before deletion
        const isMatch = await bcrypt.compare(confirmPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password confirmation" });
        }

        // Delete profile first
        await InternProfile.findOneAndDelete({ userId: req.user.id });

        // Delete user account
        await User.findByIdAndDelete(req.user.id);

        res.json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   POST /api/intern-profile/invite
// @desc    Send invitation to join the platform
// @access  Private (Intern only)
router.post("/invite", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== "intern") {
            return res.status(403).json({ message: "Access denied. Intern role required." });
        }

        const { emails, message } = req.body;

        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return res.status(400).json({ message: "Please provide valid email addresses" });
        }

        // Here you would typically integrate with an email service
        // For now, we'll just simulate the invitation process
        const invitations = emails.map(email => ({
            email,
            invitedBy: req.user.id,
            invitedAt: new Date(),
            message: message || `${user.name} has invited you to join our internship platform!`
        }));

        // In a real application, you would:
        // 1. Save invitations to database
        // 2. Send actual emails using nodemailer or similar service
        // 3. Generate invitation tokens/links

        res.json({
            message: `Invitations sent successfully to ${emails.length} recipients`,
            invitations: invitations
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   GET /api/intern-profile/public/:userId
// @desc    Get public profile information (for admins/mentors)
// @access  Private (Admin/Mentor only)
router.get("/public/:userId", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== "admin" && user.role !== "mentor") {
            return res.status(403).json({ message: "Access denied. Admin or mentor role required." });
        }

        const profile = await InternProfile.findOne({ userId: req.params.userId })
            .populate("userId", "name email")
            .select("-visibility");

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;