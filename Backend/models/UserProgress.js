const mongoose = require('mongoose');

const videoProgressSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true // in seconds
  },
  watchedDuration: {
    type: Number,
    default: 0 // in seconds
  },
  completed: {
    type: Boolean,
    default: false
  },
  lastWatchedAt: {
    type: Date,
    default: Date.now
  },
  notes: [{
    timestamp: {
      type: Number,
      required: true // in seconds
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  bookmarked: {
    type: Boolean,
    default: false
  }
});

const moduleProgressSchema = new mongoose.Schema({
  moduleId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  videos: [videoProgressSchema],
  totalVideos: {
    type: Number,
    default: 0
  },
  completedVideos: {
    type: Number,
    default: 0
  },
  progressPercentage: {
    type: Number,
    default: 0
  }
});

const courseProgressSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  enrolled: {
    type: Boolean,
    default: false
  },
  enrolledAt: {
    type: Date
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  modules: [moduleProgressSchema],
  totalModules: {
    type: Number,
    default: 0
  },
  completedModules: {
    type: Number,
    default: 0
  },
  progressPercentage: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number,
    default: 0 // in minutes
  },
  bookmarked: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String
  }
});

// Roadmap progress schema (similar to course but for roadmaps)
const roadmapStepProgressSchema = new mongoose.Schema({
  stepId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  videos: [videoProgressSchema],
  totalVideos: {
    type: Number,
    default: 0
  },
  completedVideos: {
    type: Number,
    default: 0
  },
  progressPercentage: {
    type: Number,
    default: 0
  }
});

const roadmapProgressSchema = new mongoose.Schema({
  roadmapId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  enrolled: {
    type: Boolean,
    default: false
  },
  enrolledAt: {
    type: Date
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  steps: [roadmapStepProgressSchema],
  totalSteps: {
    type: Number,
    default: 0
  },
  completedSteps: {
    type: Number,
    default: 0
  },
  progressPercentage: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number,
    default: 0 // in minutes
  },
  bookmarked: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String
  }
});

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  courses: [courseProgressSchema],
  roadmaps: [roadmapProgressSchema],
  totalCoursesEnrolled: {
    type: Number,
    default: 0
  },
  totalCoursesCompleted: {
    type: Number,
    default: 0
  },
  totalRoadmapsEnrolled: {
    type: Number,
    default: 0
  },
  totalRoadmapsCompleted: {
    type: Number,
    default: 0
  },
  totalTimeSpent: {
    type: Number,
    default: 0 // in minutes
  },
  achievements: [{
    type: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  preferences: {
    autoplay: {
      type: Boolean,
      default: true
    },
    playbackSpeed: {
      type: Number,
      default: 1.0
    },
    notifications: {
      courseUpdates: {
        type: Boolean,
        default: true
      },
      achievements: {
        type: Boolean,
        default: true
      },
      reminders: {
        type: Boolean,
        default: true
      }
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
userProgressSchema.index({ userId: 1 });
userProgressSchema.index({ 'courses.courseId': 1 });
userProgressSchema.index({ 'courses.lastAccessedAt': -1 });

// Methods to calculate progress
userProgressSchema.methods.calculateCourseProgress = function(courseId) {
  const course = this.courses.find(c => c.courseId === courseId);
  if (!course) return 0;
  
  if (course.totalModules === 0) return 0;
  return Math.round((course.completedModules / course.totalModules) * 100);
};

userProgressSchema.methods.calculateModuleProgress = function(courseId, moduleId) {
  const course = this.courses.find(c => c.courseId === courseId);
  if (!course) return 0;
  
  const module = course.modules.find(m => m.moduleId === moduleId);
  if (!module || module.totalVideos === 0) return 0;
  
  return Math.round((module.completedVideos / module.totalVideos) * 100);
};

userProgressSchema.methods.updateVideoProgress = function(courseId, moduleId, videoId, watchedDuration, completed = false) {
  const course = this.courses.find(c => c.courseId === courseId);
  if (!course) return false;
  
  const module = course.modules.find(m => m.moduleId === moduleId);
  if (!module) return false;
  
  const video = module.videos.find(v => v.videoId === videoId);
  if (!video) return false;
  
  video.watchedDuration = watchedDuration;
  video.lastWatchedAt = new Date();
  
  if (completed && !video.completed) {
    video.completed = true;
    module.completedVideos += 1;
    
    // Check if module is completed
    if (module.completedVideos === module.totalVideos && !module.completed) {
      module.completed = true;
      module.completedAt = new Date();
      course.completedModules += 1;
      
      // Check if course is completed
      if (course.completedModules === course.totalModules && !course.completed) {
        course.completed = true;
        course.completedAt = new Date();
        this.totalCoursesCompleted += 1;
      }
    }
  }
  
  // Update progress percentages
  module.progressPercentage = this.calculateModuleProgress(courseId, moduleId);
  course.progressPercentage = this.calculateCourseProgress(courseId);
  course.lastAccessedAt = new Date();
  
  return true;
};

module.exports = mongoose.model('UserProgress', userProgressSchema);