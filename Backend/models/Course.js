const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true // in seconds
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  order: {
    type: Number,
    required: true
  },
  resources: [{
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['pdf', 'link', 'code', 'exercise'],
      required: true
    }
  }],
  quiz: {
    questions: [{
      question: {
        type: String,
        required: true
      },
      options: [{
        type: String,
        required: true
      }],
      correctAnswer: {
        type: Number,
        required: true
      },
      explanation: {
        type: String
      }
    }]
  }
});

const moduleSchema = new mongoose.Schema({
  moduleId: {
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
  order: {
    type: Number,
    required: true
  },
  videos: [videoSchema],
  estimatedDuration: {
    type: Number,
    required: true // in minutes
  },
  prerequisites: [{
    type: String // moduleId of prerequisite modules
  }]
});

const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
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
  duration: {
    type: String,
    required: true
  },
  estimatedHours: {
    type: Number,
    required: true
  },
  skills: [{
    type: String,
    required: true
  }],
  prerequisites: [{
    type: String
  }],
  learningOutcomes: [{
    type: String,
    required: true
  }],
  modules: [moduleSchema],
  instructor: {
    name: {
      type: String,
      required: true
    },
    bio: {
      type: String
    },
    avatar: {
      type: String
    },
    expertise: [{
      type: String
    }]
  },
  thumbnailUrl: {
    type: String
  },
  bannerUrl: {
    type: String
  },
  color: {
    type: String,
    default: 'from-blue-500 to-purple-600'
  },
  icon: {
    type: String,
    default: 'Code'
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    default: 0 // 0 for free courses
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Indexes for better performance
courseSchema.index({ courseId: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ difficulty: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ 'rating.average': -1 });
courseSchema.index({ enrollmentCount: -1 });

// Virtual for total videos count
courseSchema.virtual('totalVideos').get(function() {
  return this.modules.reduce((total, module) => total + module.videos.length, 0);
});

// Virtual for total duration in minutes
courseSchema.virtual('totalDurationMinutes').get(function() {
  return this.modules.reduce((total, module) => {
    return total + module.videos.reduce((moduleTotal, video) => {
      return moduleTotal + Math.ceil(video.duration / 60);
    }, 0);
  }, 0);
});

// Method to get course structure for progress tracking
courseSchema.methods.getProgressStructure = function() {
  return {
    courseId: this.courseId,
    title: this.title,
    category: this.category,
    difficulty: this.difficulty,
    totalModules: this.modules.length,
    modules: this.modules.map(module => ({
      moduleId: module.moduleId,
      title: module.title,
      totalVideos: module.videos.length,
      videos: module.videos.map(video => ({
        videoId: video.videoId,
        title: video.title,
        duration: video.duration
      }))
    }))
  };
};

module.exports = mongoose.model('Course', courseSchema);