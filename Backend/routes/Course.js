const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const UserProgress = require('../models/UserProgress');
const { authenticateToken: auth } = require('../middleware/auth');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, search, featured } = req.query;
    let query = { isPublished: true };

    if (category && category !== 'All Roadmaps') {
      query.category = category;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const courses = await Course.find(query)
      .select('-modules.videos.videoUrl') // Don't send video URLs in list view
      .sort({ isFeatured: -1, 'rating.average': -1, enrollmentCount: -1 });

    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course by ID with full details
router.get('/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findOne({ courseId, isPublished: true });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course with user progress (requires auth)
router.get('/:courseId/with-progress', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findOne({ courseId, isPublished: true });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const userProgress = await UserProgress.findOne({ userId: req.user.id });
    let courseProgress = null;

    if (userProgress) {
      courseProgress = userProgress.courses.find(c => c.courseId === courseId);
    }

    res.json({
      course,
      progress: courseProgress || null,
      isEnrolled: !!courseProgress
    });
  } catch (error) {
    console.error('Error fetching course with progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get video details (requires enrollment)
router.get('/:courseId/module/:moduleId/video/:videoId', auth, async (req, res) => {
  try {
    const { courseId, moduleId, videoId } = req.params;

    // Check if user is enrolled
    const userProgress = await UserProgress.findOne({ userId: req.user.id });
    if (!userProgress) {
      return res.status(403).json({ message: 'Not enrolled in any courses' });
    }

    const courseProgress = userProgress.courses.find(c => c.courseId === courseId);
    if (!courseProgress) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    // Get course and video details
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const module = course.modules.find(m => m.moduleId === moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const video = module.videos.find(v => v.videoId === videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Get user's progress for this video
    const moduleProgress = courseProgress.modules.find(m => m.moduleId === moduleId);
    const videoProgress = moduleProgress ? moduleProgress.videos.find(v => v.videoId === videoId) : null;

    res.json({
      video,
      progress: videoProgress || {
        watchedDuration: 0,
        completed: false,
        notes: [],
        bookmarked: false
      }
    });
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rate a course
router.post('/:courseId/rate', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, review } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user is enrolled
    const userProgress = await UserProgress.findOne({ userId: req.user.id });
    if (!userProgress) {
      return res.status(403).json({ message: 'Not enrolled in any courses' });
    }

    const courseProgress = userProgress.courses.find(c => c.courseId === courseId);
    if (!courseProgress) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    // Update user's rating
    const previousRating = courseProgress.rating;
    courseProgress.rating = rating;
    if (review) {
      courseProgress.review = review;
    }

    // Update course rating
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (previousRating) {
      // Update existing rating
      const totalRating = course.rating.average * course.rating.count;
      const newTotal = totalRating - previousRating + rating;
      course.rating.average = newTotal / course.rating.count;
    } else {
      // New rating
      const totalRating = course.rating.average * course.rating.count + rating;
      course.rating.count += 1;
      course.rating.average = totalRating / course.rating.count;
    }

    await Promise.all([userProgress.save(), course.save()]);

    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Error rating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Course.distinct('category', { isPublished: true });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course statistics
router.get('/meta/stats', async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments({ isPublished: true });
    const totalEnrollments = await Course.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: null, total: { $sum: '$enrollmentCount' } } }
    ]);

    const categoryCounts = await Course.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalCourses,
      totalEnrollments: totalEnrollments[0]?.total || 0,
      categoryCounts
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;