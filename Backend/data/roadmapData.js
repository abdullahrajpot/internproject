const roadmapData = {
  1: {
    id: 1,
    title: "Frontend Beginner",
    category: "Absolute Beginners",
    description: "Start your journey with HTML, CSS, and JavaScript basics",
    icon: "Code",
    difficulty: "Beginner",
    duration: "3-4 months",
    skills: ["HTML", "CSS", "JavaScript", "Git"],
    color: "from-orange-500 to-red-500",
    lastUpdated: "December 15, 2024",
    totalSteps: 8,
    steps: [
      { 
        id: 1, 
        title: "HTML Fundamentals", 
        description: "Learn the basics of HTML and how to structure web pages", 
        type: "foundation", 
        resources: [
          { title: "HTML Crash Course Playlist", url: "https://www.youtube.com/embed/videoseries?list=PLu71SKxNbfoDBNF5s-WH6aLbthSEIMhMI" },
          { title: "HTML5 in 1 Shot Explained", url: "https://www.youtube.com/embed/HD13eq_Pmp8" }
        ]
      },
      { 
        id: 2, 
        title: "CSS Styling", 
        description: "Master styling, layouts, and responsive design", 
        type: "foundation", 
        resources: [
          { title: "CSS RoadMap Guide Course", url: "https://www.youtube.com/embed/aLzfFJb8rWo" },
          { title: "CSS Crash Course", url: "https://www.youtube.com/embed/WuiB5TAQOAM" }
        ]
      },
      { 
        id: 3, 
        title: "JavaScript Basics", 
        description: "Learn programming fundamentals and DOM manipulation", 
        type: "core", 
        resources: [
          { title: "JavaScript Playlist for Beginners", url: "https://www.youtube.com/embed/videoseries?list=PLu71SKxNbfoBuX3f4EOACle2y-tRC5Q37" },
          { title: "Javascript Playlist in 1 Shot", url: "https://www.youtube.com/embed/videoseries?list=PLHzs8hOU-sf5_9JNubPJpgMvTQSlaeRCe" }
        ]
      },
      { 
        id: 4, 
        title: "Version Control", 
        description: "Learn Git and GitHub for code management", 
        type: "tool", 
        resources: [
          { title: "Git & GitHub Crash Course in Hindi", url: "https://www.youtube.com/embed/q8EevlEpQ2A" },
          { title: "Git & GitHub Crash Course in Hindi", url: "https://www.youtube.com/embed/gwWKnnCMQ5c" }
        ]
      },
      { 
        id: 5, 
        title: "CSS Frameworks", 
        description: "Explore frameworks like Tailwind CSS or Bootstrap", 
        type: "enhancement", 
        resources: [
          { title: "Tailwind CSS Crash Course", url: "https://www.youtube.com/embed/_9mTJ84uL1Q" },
          { title: "Bootstrap 5 Crash Course", url: "https://www.youtube.com/embed/-qfEOE4vtxE" }
        ]
      },
      { 
        id: 6, 
        title: "JavaScript Frameworks", 
        description: "Choose and learn React, Vue, or Angular", 
        type: "core", 
        resources: [
          { title: "React JS Crash Course", url: "https://www.youtube.com/embed/videoseries?list=PLu71SKxNbfoDqgPchmvIsL4hTnJIrtige" },
          { title: "Vue JS Crash Course", url: "https://www.youtube.com/embed/videoseries?list=PLRAV69dS1uWTpHQgiV4rZFlnuS8XDl71A" },
          { title: "Angular Crash Course", url: "https://www.youtube.com/embed/0LhBvp8qpro" }
        ]
      },
      { 
        id: 7, 
        title: "Build Tools", 
        description: "Learn about bundlers like Webpack, Vite, or Parcel", 
        type: "tool", 
        resources: [
          { title: "Webpack Crash Course", url: "https://www.youtube.com/embed/IZGNcSuwBZs" },
          { title: "Vite in 100 Seconds", url: "https://www.youtube.com/embed/KCrXgy8qtjM" }
        ]
      },
      { 
        id: 8, 
        title: "Deployment", 
        description: "Learn CI/CD, hosting platforms, and deployment strategies", 
        type: "final", 
        resources: [
          { title: "Deploy React App to Netlify", url: "https://www.youtube.com/embed/8YPXv7xKh2w" },
          { title: "Deploy React App to Vercel", url: "https://www.youtube.com/embed/hAuyNf0Uk-w" }
        ]
      }
    ]
  },
  2: {
    id: 2,
    title: "Backend Beginner",
    category: "Absolute Beginners",
    description: "Learn server-side programming and database fundamentals",
    icon: "Server",
    difficulty: "Beginner",
    duration: "4-5 months",
    skills: ["Node.js", "Express", "MongoDB", "APIs"],
    color: "from-red-500 to-orange-600",
    lastUpdated: "December 15, 2024",
    totalSteps: 10,
    steps: [
      { 
        id: 1, 
        title: "Programming Fundamentals", 
        description: "Learn basic programming concepts and logic", 
        type: "foundation", 
        resources: [
          { title: "Variable, Datatype, Object", url: "https://www.youtube.com/embed/HGCDMJXS1cc?si=65xKg5SzzzDkFSBn" },
          { title: "Control Structure", url: "https://www.youtube.com/embed/1R4NGtsj7hw?si=xNgI737cYEzcN1xk" },
          { title: "Functions", url: "https://www.youtube.com/embed/Jtc3j4ZNZEQ?si=RAFjv2akhl9tOWGB" },
          { title: "Loops", url: "https://www.youtube.com/embed/y32sWmu-RI4?si=gZdVaQWsyobIiey2" }
        ]
      },
      { 
        id: 2, 
        title: "JavaScript for Backend", 
        description: "Master JavaScript for server-side development", 
        type: "core", 
        resources: [
          { title: "ES6+ Features", url: "https://www.youtube.com/embed/WZQc7RUAg18" },
          { title: "Async Programming", url: "https://www.youtube.com/embed/PoRJizFvM7s" }
        ]
      }
    ]
  },
  3: {
    id: 3,
    title: "Full Stack Developer",
    category: "Web Development",
    description: "Complete web development with modern tech stack",
    icon: "Zap",
    difficulty: "Intermediate",
    duration: "8-12 months",
    skills: ["HTML", "CSS", "JavaScript", "Node.js", "React", "MongoDB", "Express", "APIs"],
    color: "from-red-500 to-orange-600",
    lastUpdated: "December 15, 2024",
    totalSteps: 10,
    steps: [
      { 
        id: 1, 
        title: "Frontend Basics", 
        description: "HTML, CSS, JavaScript essentials", 
        type: "foundation", 
        resources: [
          { title: "HTML Basics", url: "https://www.youtube.com/embed/UB1O30fR-EE" },
          { title: "CSS Fundamentals", url: "https://www.youtube.com/embed/yfoY53QXEnI" }
        ]
      }
    ]
  }
};

const getAllRoadmaps = () => {
  return Object.values(roadmapData);
};

const getRoadmapById = (id) => {
  return roadmapData[id];
};

module.exports = {
  roadmapData,
  getAllRoadmaps,
  getRoadmapById
};