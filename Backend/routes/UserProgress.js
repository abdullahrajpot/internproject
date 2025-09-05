const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');
const Course = require('../models/Course');
const { authenticateToken: auth } = require('../middleware/auth');

// Get user's overall progress
router.get('/', auth, async (req, res) => {
  try {
    let userProgress = await UserProgress.findOne({ userId: req.user.id });
    
    if (!userProgress) {
      userProgress = new UserProgress({
        userId: req.user.id,
        courses: [],
        roadmaps: [],
        totalCoursesEnrolled: 0,
        totalCoursesCompleted: 0,
        totalTimeSpent: 0,
        achievements: []
      });
      await userProgress.save();
    }

    res.json(userProgress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Enroll in a course
router.post('/enroll/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Check if course exists
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let userProgress = await UserProgress.findOne({ userId: req.user.id });
    
    if (!userProgress) {
      userProgress = new UserProgress({ userId: req.user.id });
    }

    // Check if already enrolled
    const existingCourse = userProgress.courses.find(c => c.courseId === courseId);
    if (existingCourse) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create course progress structure
    const courseProgress = {
      courseId: course.courseId,
      title: course.title,
      category: course.category,
      difficulty: course.difficulty,
      enrolled: true,
      enrolledAt: new Date(),
      totalModules: course.modules.length,
      modules: course.modules.map(module => ({
        moduleId: module.moduleId,
        title: module.title,
        totalVideos: module.videos.length,
        videos: module.videos.map(video => ({
          videoId: video.videoId,
          title: video.title,
          duration: video.duration,
          watchedDuration: 0,
          completed: false,
          notes: [],
          bookmarked: false
        }))
      }))
    };

    userProgress.courses.push(courseProgress);
    userProgress.totalCoursesEnrolled += 1;

    // Update course enrollment count
    course.enrollmentCount += 1;
    await course.save();

    await userProgress.save();

    res.json({ 
      message: 'Successfully enrolled in course',
      courseProgress: courseProgress
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get progress for a specific course
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const userProgress = await UserProgress.findOne({ userId: req.user.id });
    if (!userProgress) {
      return res.status(404).json({ message: 'No progress found' });
    }

    const courseProgress = userProgress.courses.find(c => c.courseId === courseId);
    if (!courseProgress) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }

    res.json(courseProgress);
  } catch (error) {
    console.error('Error fetching course progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update video progress
router.put('/video/:courseId/:moduleId/:videoId', auth, async (req, res) => {
  try {
    const { courseId, moduleId, videoId } = req.params;
    const { watchedDuration, completed, timeSpent } = req.body;

    const userProgress = await UserProgress.findOne({ userId: req.user.id });
    if (!userProgress) {
      return res.status(404).json({ message: 'No progress found' });
    }

    const success = userProgress.updateVideoProgress(courseId, moduleId, videoId, watchedDuration, completed);
    if (!success) {
      return res.status(404).json({ message: 'Video not found in progress' });
    }

    // Update time spent
    if (timeSpent) {
      const course = userProgress.courses.find(c => c.courseId === courseId);
      course.timeSpent += timeSpent;
      userProgress.totalTimeSpent += timeSpent;
    }

    await userProgress.save();

    // Check for achievements
    await checkAndAwardAchievements(userProgress);

    res.json({ message: 'Video progress updated successfully' });
  } catch (error) {
    console.error('Error updating video progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add note to video
router.post('/video/:courseId/:moduleId/:videoId/notes', auth, async (req, res) => {
  try {
    const { courseId, moduleId, videoId } = req.params;
    const { timestamp, content } = req.body;

    const userProgress = await UserProgress.findOne({ userId: req.user.id });
    if (!userProgress) {
      return res.status(404).json({ message: 'No progress found' });
    }

    const course = userProgress.courses.find(c => c.courseId === courseId);
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

    const note = {
      timestamp,
      content,
      createdAt: new Date()
    };

    video.notes.push(note);
    await userProgress.save();

    res.json({ message: 'Note added successfully', note });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get notes for a video
router.get('/video/:courseId/:moduleId/:videoId/notes', auth, async (req, res) => {
  try {
    const { courseId, moduleId, videoId } = req.params;

    const userProgress = await UserProgress.findOne({ userId: req.user.id });
    if (!userProgress) {
      return res.status(404).json({ message: 'No progress found' });
    }

    const course = userProgress.courses.find(c => c.courseId === courseId);
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

    res.json(video.notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle bookmark for course
router.put('/course/:courseId/bookmark', auth, async (req, res) => {
  try {
    const { courseId } = req.params;

    const userProgress = await UserProgress.findOne({ userId: req.user.id });
    if (!userProgress) {
      return res.status(404).json({ message: 'No progress found' });
    }

    const course = userProgress.courses.find(c => c.courseId === courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.bookmarked = !course.bookmarked;
    await userProgress.save();

    res.json({ 
      message: `Course ${course.bookmarked ? 'bookmarked' : 'unbookmarked'} successfully`,
      bookmarked: course.bookmarked
    });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user achievements
router.get('/achievements', auth, async (req, res) => {
  try {
    const userProgress = await UserProgress.findOne({ userId: req.user.id });
    if (!userProgress) {
      return res.json([]);
    }

    res.json(userProgress.achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { preferences } = req.body;

    const userProgress = await UserProgress.findOne({ userId: req.user.id });
    if (!userProgress) {
      return res.status(404).json({ message: 'No progress found' });
    }

    userProgress.preferences = { ...userProgress.preferences, ...preferences };
    await userProgress.save();

    res.json({ message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to check and award achievements
async function checkAndAwardAchievements(userProgress) {
  const achievements = [];

  // First course completion
  if (userProgress.totalCoursesCompleted === 1) {
    achievements.push({
      type: 'first_course',
      title: 'First Steps',
      description: 'Completed your first course!',
      icon: '🎉'
    });
  }

  // Multiple course completions
  if (userProgress.totalCoursesCompleted === 5) {
    achievements.push({
      type: 'five_courses',
      title: 'Learning Enthusiast',
      description: 'Completed 5 courses!',
      icon: '🏆'
    });
  }

  // Time spent milestones
  if (userProgress.totalTimeSpent >= 600) { // 10 hours
    const hasAchievement = userProgress.achievements.some(a => a.type === 'ten_hours');
    if (!hasAchievement) {
      achievements.push({
        type: 'ten_hours',
        title: 'Dedicated Learner',
        description: 'Spent 10 hours learning!',
        icon: '⏰'
      });
    }
  }

  // Add new achievements
  for (const achievement of achievements) {
    const exists = userProgress.achievements.some(a => a.type === achievement.type);
    if (!exists) {
      userProgress.achievements.push(achievement);
    }
  }

  if (achievements.length > 0) {
    await userProgress.save();
  }
}

// Enroll in roadmap
router.post('/enroll-roadmap/:roadmapId', auth, async (req, res) => {
  try {
    const { roadmapId } = req.params;
    
    // Get roadmap data from local data (you can import it or fetch from a service)
    const { getRoadmapById } = require('../data/roadmapData');
    const roadmapData = getRoadmapById(parseInt(roadmapId));
    
    if (!roadmapData) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    let userProgress = await UserProgress.findOne({ userId: req.user.id });
    
    if (!userProgress) {
      userProgress = new UserProgress({
        userId: req.user.id,
        courses: [],
        roadmaps: []
      });
    }

    // Check if already enrolled
    const existingRoadmap = userProgress.roadmaps.find(r => r.roadmapId === roadmapId);
    if (existingRoadmap) {
      return res.status(400).json({ message: 'Already enrolled in this roadmap' });
    }

    // Create roadmap progress structure
    const roadmapProgress = {
      roadmapId: roadmapId,
      title: roadmapData.title,
      category: roadmapData.category,
      difficulty: roadmapData.difficulty,
      enrolled: true,
      enrolledAt: new Date(),
      totalSteps: roadmapData.totalSteps,
      steps: roadmapData.steps.map(step => ({
        stepId: step.id.toString(),
        title: step.title,
        totalVideos: step.resources?.length || 0,
        videos: (step.resources || []).map((resource, index) => ({
          videoId: `${step.id}-${index}`,
          title: resource.title,
          duration: 600, // Default duration, you can calculate this
          watchedDuration: 0,
          completed: false,
          notes: [],
          bookmarked: false
        }))
      }))
    };

    userProgress.roadmaps.push(roadmapProgress);
    userProgress.totalRoadmapsEnrolled += 1;

    await userProgress.save();

    res.json({ message: 'Successfully enrolled in roadmap', roadmap: roadmapProgress });
  } catch (error) {
    console.error('Error enrolling in roadmap:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle roadmap bookmark
router.put('/roadmap/:roadmapId/bookmark', auth, async (req, res) => {
  try {
    const { roadmapId } = req.params;
    
    const userProgress = await UserProgress.findOne({ userId: req.user.id });
    if (!userProgress) {
      return res.status(404).json({ message: 'User progress not found' });
    }

    const roadmap = userProgress.roadmaps.find(r => r.roadmapId === roadmapId);
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found in user progress' });
    }

    roadmap.bookmarked = !roadmap.bookmarked;
    await userProgress.save();

    res.json({ bookmarked: roadmap.bookmarked });
  } catch (error) {
    console.error('Error toggling roadmap bookmark:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update roadmap video progress
router.put('/roadmap/:roadmapId/step/:stepId/video/:videoId', auth, async (req, res) => {
  try {
    const { roadmapId, stepId, videoId } = req.params;
    const { watchedDuration, completed, timeSpent } = req.body;
    
    let userProgress = await UserProgress.findOne({ userId: req.user.id });
    if (!userProgress) {
      return res.status(404).json({ message: 'User progress not found' });
    }

    const roadmap = userProgress.roadmaps.find(r => r.roadmapId === roadmapId);
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found in user progress' });
    }

    let step = roadmap.steps.find(s => s.stepId === stepId);
    if (!step) {
      // Create step if it doesn't exist
      step = {
        stepId: stepId,
        title: `Step ${stepId}`,
        completed: false,
        videos: [],
        totalVideos: 0,
        completedVideos: 0,
        progressPercentage: 0
      };
      roadmap.steps.push(step);
    }

    let video = step.videos.find(v => v.videoId === videoId);
    if (!video) {
      // Create video if it doesn't exist
      video = {
        videoId: videoId,
        title: `Video ${videoId}`,
        duration: 600, // Default 10 minutes
        watchedDuration: 0,
        completed: false,
        notes: [],
        bookmarked: false
      };
      step.videos.push(video);
      step.totalVideos = step.videos.length;
    }

    // Update video progress
    const wasCompleted = video.completed;
    video.watchedDuration = watchedDuration;
    video.completed = completed;
    video.lastWatchedAt = new Date();

    // Update step progress
    if (completed && !wasCompleted) {
      step.completedVideos += 1;
    } else if (!completed && wasCompleted) {
      step.completedVideos -= 1;
    }

    step.progressPercentage = step.totalVideos > 0 ? Math.round((step.completedVideos / step.totalVideos) * 100) : 0;
    step.completed = step.completedVideos === step.totalVideos;

    // Update roadmap progress
    roadmap.completedSteps = roadmap.steps.filter(s => s.completed).length;
    roadmap.progressPercentage = roadmap.totalSteps > 0 ? Math.round((roadmap.completedSteps / roadmap.totalSteps) * 100) : 0;
    roadmap.completed = roadmap.completedSteps === roadmap.totalSteps;
    roadmap.lastAccessedAt = new Date();

    if (timeSpent) {
      roadmap.timeSpent += timeSpent;
      userProgress.totalTimeSpent += timeSpent;
    }

    await userProgress.save();

    res.json({ message: 'Video progress updated successfully', video });
  } catch (error) {
    console.error('Error updating video progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add note to roadmap video
router.post('/roadmap/:roadmapId/step/:stepId/video/:videoId/notes', auth, async (req, res) => {
  try {
    const { roadmapId, stepId, videoId } = req.params;
    const { timestamp, content } = req.body;
    
    const userProgress = await UserProgress.findOne({ userId: req.user.id });
    if (!userProgress) {
      return res.status(404).json({ message: 'User progress not found' });
    }

    const roadmap = userProgress.roadmaps.find(r => r.roadmapId === roadmapId);
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found in user progress' });
    }

    const step = roadmap.steps.find(s => s.stepId === stepId);
    if (!step) {
      return res.status(404).json({ message: 'Step not found in roadmap progress' });
    }

    const video = step.videos.find(v => v.videoId === videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found in step progress' });
    }

    const note = {
      timestamp,
      content,
      createdAt: new Date()
    };

    video.notes.push(note);
    await userProgress.save();

    res.json({ message: 'Note added successfully', note });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle roadmap video bookmark
router.put('/roadmap/:roadmapId/step/:stepId/video/:videoId/bookmark', auth, async (req, res) => {
  try {
    const { roadmapId, stepId, videoId } = req.params;
    
    const userProgress = await UserProgress.findOne({ userId: req.user.id });
    if (!userProgress) {
      return res.status(404).json({ message: 'User progress not found' });
    }

    const roadmap = userProgress.roadmaps.find(r => r.roadmapId === roadmapId);
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found in user progress' });
    }

    const step = roadmap.steps.find(s => s.stepId === stepId);
    if (!step) {
      return res.status(404).json({ message: 'Step not found in roadmap progress' });
    }

    const video = step.videos.find(v => v.videoId === videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found in step progress' });
    }

    video.bookmarked = !video.bookmarked;
    await userProgress.save();

    res.json({ bookmarked: video.bookmarked });
  } catch (error) {
    console.error('Error toggling video bookmark:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit roadmap video note
router.put('/roadmap/:roadmapId/step/:stepId/video/:videoId/notes/:noteId', auth, async (req, res) => {
  try {
    const { roadmapId, stepId, videoId, noteId } = req.params;
    const { content } = req.body;
    
    const userProgress = await UserProgress.findOne({ userId: req.user.id });
    if (!userProgress) {
      return res.status(404).json({ message: 'User progress not found' });
    }

    const roadmap = userProgress.roadmaps.find(r => r.roadmapId === roadmapId);
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found in user progress' });
    }

    const step = roadmap.steps.find(s => s.stepId === stepId);
    if (!step) {
      return res.status(404).json({ message: 'Step not found in roadmap progress' });
    }

    const video = step.videos.find(v => v.videoId === videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found in step progress' });
    }

    const note = video.notes.id(noteId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.content = content;
    note.updatedAt = new Date();
    await userProgress.save();

    res.json({ message: 'Note updated successfully', note });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete roadmap video note
router.delete('/roadmap/:roadmapId/step/:stepId/video/:videoId/notes/:noteId', auth, async (req, res) => {
  try {
    const { roadmapId, stepId, videoId, noteId } = req.params;
    
    const userProgress = await UserProgress.findOne({ userId: req.user.id });
    if (!userProgress) {
      return res.status(404).json({ message: 'User progress not found' });
    }

    const roadmap = userProgress.roadmaps.find(r => r.roadmapId === roadmapId);
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found in user progress' });
    }

    const step = roadmap.steps.find(s => s.stepId === stepId);
    if (!step) {
      return res.status(404).json({ message: 'Step not found in roadmap progress' });
    }

    const video = step.videos.find(v => v.videoId === videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found in step progress' });
    }

    const noteIndex = video.notes.findIndex(note => note._id.toString() === noteId);
    if (noteIndex === -1) {
      return res.status(404).json({ message: 'Note not found' });
    }

    video.notes.splice(noteIndex, 1);
    await userProgress.save();

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;