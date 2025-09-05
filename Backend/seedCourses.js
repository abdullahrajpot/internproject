const mongoose = require('mongoose');
const Course = require('./models/Course');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const sampleCourses = [
  {
    courseId: 'frontend-fundamentals',
    title: 'Frontend Development Fundamentals',
    description: 'Learn the basics of frontend development with HTML, CSS, and JavaScript. Perfect for beginners starting their web development journey.',
    category: 'Web Development',
    difficulty: 'Beginner',
    duration: '8 weeks',
    estimatedHours: 40,
    skills: ['HTML', 'CSS', 'JavaScript', 'Responsive Design', 'DOM Manipulation'],
    prerequisites: [],
    learningOutcomes: [
      'Build responsive websites with HTML and CSS',
      'Create interactive web pages with JavaScript',
      'Understand modern web development best practices',
      'Deploy websites to production'
    ],
    modules: [
      {
        moduleId: 'html-basics',
        title: 'HTML Fundamentals',
        description: 'Learn the structure and semantics of HTML',
        order: 1,
        estimatedDuration: 300,
        videos: [
          {
            videoId: 'html-intro',
            title: 'Introduction to HTML',
            description: 'What is HTML and why do we need it?',
            duration: 600,
            videoUrl: 'https://example.com/videos/html-intro.mp4',
            thumbnailUrl: 'https://example.com/thumbnails/html-intro.jpg',
            order: 1,
            resources: [
              {
                title: 'HTML Cheat Sheet',
                url: 'https://example.com/resources/html-cheat-sheet.pdf',
                type: 'pdf'
              }
            ]
          },
          {
            videoId: 'html-elements',
            title: 'HTML Elements and Tags',
            description: 'Understanding different HTML elements and their usage',
            duration: 900,
            videoUrl: 'https://example.com/videos/html-elements.mp4',
            thumbnailUrl: 'https://example.com/thumbnails/html-elements.jpg',
            order: 2,
            resources: []
          }
        ]
      },
      {
        moduleId: 'css-basics',
        title: 'CSS Fundamentals',
        description: 'Style your HTML with CSS',
        order: 2,
        estimatedDuration: 400,
        videos: [
          {
            videoId: 'css-intro',
            title: 'Introduction to CSS',
            description: 'Learn how to style HTML elements',
            duration: 720,
            videoUrl: 'https://example.com/videos/css-intro.mp4',
            thumbnailUrl: 'https://example.com/thumbnails/css-intro.jpg',
            order: 1,
            resources: []
          }
        ]
      }
    ],
    instructor: {
      name: 'John Doe',
      bio: 'Senior Frontend Developer with 8+ years of experience',
      avatar: 'https://example.com/avatars/john-doe.jpg',
      expertise: ['JavaScript', 'React', 'CSS', 'HTML']
    },
    thumbnailUrl: 'https://example.com/courses/frontend-fundamentals.jpg',
    color: 'from-blue-500 to-purple-600',
    icon: 'Code',
    isPublished: true,
    isFeatured: true,
    price: 0,
    tags: ['beginner', 'web-development', 'frontend']
  },
  {
    courseId: 'react-masterclass',
    title: 'React.js Masterclass',
    description: 'Master React.js from basics to advanced concepts. Build modern, scalable web applications.',
    category: 'Frameworks',
    difficulty: 'Intermediate',
    duration: '12 weeks',
    estimatedHours: 60,
    skills: ['React', 'JSX', 'Hooks', 'State Management', 'Component Architecture'],
    prerequisites: ['JavaScript', 'HTML', 'CSS'],
    learningOutcomes: [
      'Build complex React applications',
      'Master React Hooks and Context API',
      'Implement state management solutions',
      'Optimize React app performance'
    ],
    modules: [
      {
        moduleId: 'react-basics',
        title: 'React Fundamentals',
        description: 'Learn the core concepts of React',
        order: 1,
        estimatedDuration: 500,
        videos: [
          {
            videoId: 'react-intro',
            title: 'What is React?',
            description: 'Introduction to React and its ecosystem',
            duration: 800,
            videoUrl: 'https://example.com/videos/react-intro.mp4',
            thumbnailUrl: 'https://example.com/thumbnails/react-intro.jpg',
            order: 1,
            resources: []
          }
        ]
      }
    ],
    instructor: {
      name: 'Jane Smith',
      bio: 'React Expert and Tech Lead at major tech company',
      avatar: 'https://example.com/avatars/jane-smith.jpg',
      expertise: ['React', 'JavaScript', 'TypeScript', 'Node.js']
    },
    thumbnailUrl: 'https://example.com/courses/react-masterclass.jpg',
    color: 'from-cyan-500 to-blue-600',
    icon: 'Code',
    isPublished: true,
    isFeatured: true,
    price: 0,
    tags: ['intermediate', 'react', 'javascript']
  },
  {
    courseId: 'nodejs-backend',
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js, Express, and MongoDB.',
    category: 'Web Development',
    difficulty: 'Intermediate',
    duration: '10 weeks',
    estimatedHours: 50,
    skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Authentication'],
    prerequisites: ['JavaScript', 'Basic programming concepts'],
    learningOutcomes: [
      'Build RESTful APIs with Node.js and Express',
      'Work with databases using MongoDB',
      'Implement authentication and authorization',
      'Deploy applications to cloud platforms'
    ],
    modules: [
      {
        moduleId: 'nodejs-intro',
        title: 'Introduction to Node.js',
        description: 'Understanding server-side JavaScript',
        order: 1,
        estimatedDuration: 400,
        videos: [
          {
            videoId: 'nodejs-basics',
            title: 'Node.js Fundamentals',
            description: 'What is Node.js and how does it work?',
            duration: 750,
            videoUrl: 'https://example.com/videos/nodejs-basics.mp4',
            thumbnailUrl: 'https://example.com/thumbnails/nodejs-basics.jpg',
            order: 1,
            resources: []
          }
        ]
      }
    ],
    instructor: {
      name: 'Mike Johnson',
      bio: 'Backend Developer and DevOps Engineer',
      avatar: 'https://example.com/avatars/mike-johnson.jpg',
      expertise: ['Node.js', 'Express', 'MongoDB', 'AWS']
    },
    thumbnailUrl: 'https://example.com/courses/nodejs-backend.jpg',
    color: 'from-green-500 to-teal-600',
    icon: 'Server',
    isPublished: true,
    isFeatured: false,
    price: 0,
    tags: ['backend', 'nodejs', 'api']
  }
];

async function seedCourses() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Insert sample courses
    await Course.insertMany(sampleCourses);
    console.log('Sample courses inserted successfully');

    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
}

// Run the seeder
seedCourses();