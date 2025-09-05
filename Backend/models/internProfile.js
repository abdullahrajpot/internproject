const mongoose = require("mongoose");

const internProfileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true, 
    unique: true 
  },
  
  // Personal Information
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date },
  age: { type: Number },
  gender: { 
    type: String, 
    enum: ["male", "female", "other", "prefer-not-to-say"],
    default: "prefer-not-to-say"
  },
  phoneNumber: { type: String },
  alternatePhone: { type: String },
  
  // Address Information
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String, default: "Bangladesh" }
  },
  
  // Education Information
  education: {
    currentLevel: { 
      type: String, 
      enum: ["high-school", "undergraduate", "graduate", "postgraduate", "other"] 
    },
    institution: { type: String },
    major: { type: String },
    graduationYear: { type: Number },
    cgpa: { type: Number },
    skills: [{ type: String }]
  },
  
  // Professional Information
  experience: {
    previousInternships: [{
      company: { type: String },
      position: { type: String },
      duration: { type: String },
      description: { type: String }
    }],
    projects: [{
      title: { type: String },
      description: { type: String },
      technologies: [{ type: String }],
      link: { type: String }
    }]
  },
  
  // Internship Specific
  internshipDetails: {
    department: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    mentor: { type: String },
    objectives: [{ type: String }],
    coursesInProgress: { type: Number, default: 0 },
    coursesCompleted: { type: Number, default: 0 }
  },
  
  // Profile Settings
  profilePicture: { type: String, default: "" },
  bio: { type: String, maxlength: 500 },
  socialLinks: {
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String }
  },
  
  // Privacy Settings
  visibility: {
    profile: { type: Boolean, default: true },
    contact: { type: Boolean, default: false },
    education: { type: Boolean, default: true },
    experience: { type: Boolean, default: true }
  },
  
  // Achievements and Progress
  achievements: [{
    title: { type: String },
    description: { type: String },
    dateEarned: { type: Date, default: Date.now },
    icon: { type: String }
  }],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
internProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate age from date of birth
internProfileSchema.pre('save', function(next) {
  if (this.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    this.age = age;
  }
  next();
});

module.exports = mongoose.model("InternProfile", internProfileSchema);