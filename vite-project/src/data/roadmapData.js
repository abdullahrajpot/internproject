import { Code, Server, Smartphone, Database, Cloud, Zap, Users, Brain, Shield } from 'lucide-react';

export const roadmapData = {
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
      { id: 1, title: "HTML Fundamentals", description: "Learn the basics of HTML and how to structure web pages", type: "foundation", resources: 3, estimatedTime: "1-2 weeks", topics: ["HTML tags", "Semantic HTML", "Forms", "Accessibility"], resources: [
        { title: "HTML Crash Course Playlist", url: "https://www.youtube.com/embed/videoseries?list=PLu71SKxNbfoDBNF5s-WH6aLbthSEIMhMI" },
        { title: "HTML5 in 1 Shot Explained", url: "https://www.youtube.com/embed/HD13eq_Pmp8" }
      ] },
      { id: 2, title: "CSS Styling", description: "Master styling, layouts, and responsive design", type: "foundation", resources: 4, estimatedTime: "2-3 weeks", topics: ["CSS selectors", "Box model", "Flexbox", "Grid", "Responsive design"], resources: [
        { title: "CSS RoadMap Guide Course", url: "https://www.youtube.com/embed/aLzfFJb8rWo" },
        { title: "CSS Crash Course", url: "https://www.youtube.com/embed/WuiB5TAQOAM" }
      ] },
      { id: 3, title: "JavaScript Basics", description: "Learn programming fundamentals and DOM manipulation", type: "core", resources: 6, estimatedTime: "4-6 weeks", topics: ["Variables", "Functions", "Arrays", "Objects", "DOM manipulation", "Events"], resources: [
        { title: "JavaScript Playlist for Beginners", url: "https://www.youtube.com/embed/videoseries?list=PLu71SKxNbfoBuX3f4EOACle2y-tRC5Q37" },
        { title: "Javascript Playlist in 1 Shot", url: "https://www.youtube.com/embed/videoseries?list=PLHzs8hOU-sf5_9JNubPJpgMvTQSlaeRCe" }
      ] },
      { id: 4, title: "Version Control", description: "Learn Git and GitHub for code management", type: "tool", resources: 2, estimatedTime: "1-2 weeks", topics: ["Git basics", "GitHub", "Branching", "Collaboration"], resources: [
        { title: "Git & GitHub Crash Course in Hindi", url: "https://www.youtube.com/embed/q8EevlEpQ2A" },
        { title: "Git & GitHub Crash Course in Hindi", url: "https://www.youtube.com/embed/gwWKnnCMQ5c" }
      ] },
      { id: 5, title: "CSS Frameworks", description: "Explore frameworks like Tailwind CSS or Bootstrap", type: "enhancement", resources: 3, estimatedTime: "2-3 weeks", topics: ["Tailwind CSS", "Bootstrap", "Component libraries"], resources: [
        { title: "Tailwind CSS Crash Course", url: "https://www.youtube.com/embed/_9mTJ84uL1Q" },
        { title: "Bootstrap 5 Crash Course", url: "https://www.youtube.com/embed/-qfEOE4vtxE" }
      ] },
      { id: 6, title: "JavaScript Frameworks", description: "Choose and learn React, Vue, or Angular", type: "core", resources: 8, estimatedTime: "6-8 weeks", topics: ["React basics", "Components", "State management", "Hooks", "Routing"], resources: [
        { title: "React JS Crash Course", url: "https://www.youtube.com/embed/videoseries?list=PLu71SKxNbfoDqgPchmvIsL4hTnJIrtige" },
        { title: "Vue JS Crash Course", url: "https://www.youtube.com/embed/videoseries?list=PLRAV69dS1uWTpHQgiV4rZFlnuS8XDl71A" },
        { title: "Angular Crash Course", url: "https://www.youtube.com/embed/0LhBvp8qpro" }
      ] },
      { id: 7, title: "Build Tools", description: "Learn about bundlers like Webpack, Vite, or Parcel", type: "tool", resources: 3, estimatedTime: "2-3 weeks", topics: ["Vite", "Webpack", "Package managers", "Development tools"], resources: [
        { title: "Webpack Crash Course", url: "https://www.youtube.com/embed/IZGNcSuwBZs" },
        { title: "Vite in 100 Seconds", url: "https://www.youtube.com/embed/KCrXgy8qtjM" }
      ] },
      { id: 8, title: "Deployment", description: "Learn CI/CD, hosting platforms, and deployment strategies", type: "final", resources: 4, estimatedTime: "2-3 weeks", topics: ["Netlify", "Vercel", "GitHub Pages", "Domain setup"], resources: [
        { title: "Deploy React App to Netlify", url: "https://www.youtube.com/embed/8YPXv7xKh2w" },
        { title: "Deploy React App to Vercel", url: "https://www.youtube.com/embed/hAuyNf0Uk-w" }
      ] }
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
      { id: 1, title: "Programming Fundamentals", description: "Learn basic programming concepts and logic", type: "foundation", resources: 4, estimatedTime: "2-3 weeks", topics: ["Variables", "Data types", "Control structures", "Functions"] , resources:[
        { title: "Varibale,Datatype, Object", url: "https://www.youtube.com/embed/HGCDMJXS1cc?si=65xKg5SzzzDkFSBn" },
        { title: "Control Structure", url: "https://www.youtube.com/embed/1R4NGtsj7hw?si=xNgI737cYEzcN1xk" },
        {title:"Functions", url:"https://www.youtube.com/embed/Jtc3j4ZNZEQ?si=RAFjv2akhl9tOWGB"},
        {title:"Loops", url:'https://www.youtube.com/embed/y32sWmu-RI4?si=gZdVaQWsyobIiey2'}

      ]},
      { id: 2, title: "JavaScript for Backend", description: "Master JavaScript for server-side development", type: "core", resources: 5, estimatedTime: "3-4 weeks", topics: ["ES6+ features", "Async programming", "Promises", "Modules"] },
      { id: 3, title: "Node.js Basics", description: "Learn Node.js runtime and npm package manager", type: "core", resources: 3, estimatedTime: "2-3 weeks", topics: ["Node.js setup", "npm", "File system", "Streams"] },
      { id: 4, title: "Express.js Framework", description: "Build web applications with Express.js", type: "core", resources: 4, estimatedTime: "3-4 weeks", topics: ["Routing", "Middleware", "Error handling", "Static files"] },
      { id: 5, title: "Database Fundamentals", description: "Learn database concepts and SQL basics", type: "core", resources: 4, estimatedTime: "3-4 weeks", topics: ["Database types", "SQL basics", "CRUD operations", "Relationships"] },
      { id: 6, title: "MongoDB", description: "Work with NoSQL databases using MongoDB", type: "core", resources: 3, estimatedTime: "2-3 weeks", topics: ["MongoDB setup", "Mongoose ODM", "CRUD operations", "Aggregation"] },
      { id: 7, title: "RESTful APIs", description: "Design and build RESTful APIs", type: "core", resources: 4, estimatedTime: "3-4 weeks", topics: ["HTTP methods", "API design", "Status codes", "Authentication"] },
      { id: 8, title: "Authentication & Authorization", description: "Implement user authentication and authorization", type: "advanced", resources: 3, estimatedTime: "2-3 weeks", topics: ["JWT", "Password hashing", "Session management", "OAuth"] },
      { id: 9, title: "Testing", description: "Write tests for your backend applications", type: "advanced", resources: 3, estimatedTime: "2-3 weeks", topics: ["Unit testing", "Integration testing", "Jest", "Supertest"] },
      { id: 10, title: "Deployment", description: "Deploy your backend applications", type: "final", resources: 3, estimatedTime: "2-3 weeks", topics: ["Heroku", "Railway", "Environment variables", "PM2"] }
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
      { id: 1, title: "Frontend Basics", description: "HTML, CSS, JavaScript essentials", type: "foundation", resources: 3, estimatedTime: "1-2 months", topics: ["HTML", "CSS", "JavaScript"] },
      { id: 2, title: "Version Control", description: "Git and GitHub for collaboration", type: "tool", resources: 2, estimatedTime: "1 week", topics: ["Git", "GitHub", "Branching"] },
      { id: 3, title: "Frontend Framework", description: "React fundamentals and advanced concepts", type: "core", resources: 4, estimatedTime: "2 months", topics: ["React", "Hooks", "State management", "Routing"] },
      { id: 4, title: "Backend Basics", description: "Node.js and Express.js essentials", type: "core", resources: 3, estimatedTime: "1 month", topics: ["Node.js", "Express.js", "APIs"] },
      { id: 5, title: "Database Integration", description: "MongoDB and Mongoose", type: "core", resources: 3, estimatedTime: "2 weeks", topics: ["MongoDB", "Mongoose", "CRUD"] },
      { id: 6, title: "Authentication", description: "User authentication and authorization", type: "advanced", resources: 2, estimatedTime: "2 weeks", topics: ["JWT", "OAuth", "Session management"] },
      { id: 7, title: "Testing", description: "Testing frontend and backend code", type: "advanced", resources: 2, estimatedTime: "2 weeks", topics: ["Jest", "React Testing Library", "Supertest"] },
      { id: 8, title: "Deployment", description: "Deploying full stack apps", type: "final", resources: 2, estimatedTime: "2 weeks", topics: ["Vercel", "Heroku", "Netlify"] },
      { id: 9, title: "DevOps Basics", description: "CI/CD and monitoring", type: "tool", resources: 2, estimatedTime: "2 weeks", topics: ["CI/CD", "GitHub Actions", "Monitoring"] },
      { id: 10, title: "Project", description: "Build a full stack project", type: "final", resources: 1, estimatedTime: "2 weeks", topics: ["Project planning", "Implementation", "Deployment"] }
    ]
  },
  4: {
    id: 4,
    title: "MERN Stack Developer",
    category: "Frameworks",
    description: "Master MongoDB, Express, React, and Node.js",
    icon: "Zap",
    difficulty: "Intermediate",
    duration: "8-10 months",
    skills: ["MongoDB", "Express", "React", "Node.js"],
    color: "from-green-500 to-blue-600",
    lastUpdated: "December 15, 2024",
    totalSteps: 8,
    steps: [
      { id: 1, title: "JavaScript Refresher", description: "ES6+ and modern JS", type: "foundation", resources: 2, estimatedTime: "2 weeks", topics: ["ES6", "Async/Await", "Modules"] },
      { id: 2, title: "Node.js & Express.js", description: "Backend with Node and Express", type: "core", resources: 3, estimatedTime: "1 month", topics: ["Node.js", "Express.js", "APIs"] },
      { id: 3, title: "MongoDB", description: "NoSQL database with MongoDB", type: "core", resources: 2, estimatedTime: "2 weeks", topics: ["MongoDB", "Mongoose", "Aggregation"] },
      { id: 4, title: "React", description: "Frontend with React", type: "core", resources: 3, estimatedTime: "1 month", topics: ["React", "Hooks", "State management"] },
      { id: 5, title: "Connecting MERN", description: "Integrate all four technologies", type: "advanced", resources: 2, estimatedTime: "2 weeks", topics: ["API integration", "CORS", "Authentication"] },
      { id: 6, title: "Testing", description: "Testing MERN apps", type: "advanced", resources: 2, estimatedTime: "2 weeks", topics: ["Jest", "Supertest", "React Testing Library"] },
      { id: 7, title: "Deployment", description: "Deploying MERN stack apps", type: "final", resources: 2, estimatedTime: "2 weeks", topics: ["Heroku", "Vercel", "Netlify"] },
      { id: 8, title: "Capstone Project", description: "Build a MERN stack project", type: "final", resources: 1, estimatedTime: "2 weeks", topics: ["Project planning", "Implementation", "Deployment"] }
    ]
  },
  5: {
    id: 5,
    title: "Python Programming",
    category: "Languages / Platforms",
    description: "Learn Python from basics to advanced topics",
    icon: "Brain",
    difficulty: "Beginner",
    duration: "6-8 months",
    skills: ["Python", "OOP", "Data Structures", "Web Development"],
    color: "from-yellow-500 to-green-600",
    lastUpdated: "December 15, 2024",
    totalSteps: 9,
    steps: [
      { id: 1, title: "Python Basics", description: "Syntax, variables, and data types", type: "foundation", resources: 2, estimatedTime: "2 weeks", topics: ["Syntax", "Variables", "Data types"] },
      { id: 2, title: "Control Flow", description: "If, else, loops", type: "foundation", resources: 2, estimatedTime: "2 weeks", topics: ["If", "Else", "For", "While"] },
      { id: 3, title: "Functions & Modules", description: "Defining and using functions", type: "core", resources: 2, estimatedTime: "2 weeks", topics: ["Functions", "Modules", "Import"] },
      { id: 4, title: "OOP in Python", description: "Classes and objects", type: "core", resources: 2, estimatedTime: "2 weeks", topics: ["Classes", "Objects", "Inheritance"] },
      { id: 5, title: "Data Structures", description: "Lists, tuples, sets, dicts", type: "core", resources: 2, estimatedTime: "2 weeks", topics: ["Lists", "Tuples", "Sets", "Dictionaries"] },
      { id: 6, title: "File Handling", description: "Reading and writing files", type: "tool", resources: 1, estimatedTime: "1 week", topics: ["Open", "Read", "Write", "With"] },
      { id: 7, title: "Web Development Basics", description: "Intro to Flask or Django", type: "enhancement", resources: 2, estimatedTime: "2 weeks", topics: ["Flask", "Django", "Routing"] },
      { id: 8, title: "Testing in Python", description: "Unit testing", type: "advanced", resources: 1, estimatedTime: "1 week", topics: ["unittest", "pytest"] },
      { id: 9, title: "Project", description: "Build a Python project", type: "final", resources: 1, estimatedTime: "2 weeks", topics: ["Project planning", "Implementation", "Deployment"] }
    ]
  },
  6: {
    id: 6,
    title: "DevOps Engineer",
    category: "DevOps",
    description: "Master infrastructure, automation, and monitoring",
    icon: "Cloud",
    difficulty: "Advanced",
    duration: "10-12 months",
    skills: ["Kubernetes", "Terraform", "Monitoring", "Security"],
    color: "from-red-500 to-orange-600",
    lastUpdated: "December 15, 2024",
    totalSteps: 8,
    steps: [
      { id: 1, title: "Linux & Networking", description: "Linux basics and networking concepts", type: "foundation", resources: 2, estimatedTime: "2 weeks", topics: ["Linux", "Shell", "TCP/IP", "DNS"] },
      { id: 2, title: "Version Control & Git", description: "Source control with Git", type: "tool", resources: 1, estimatedTime: "1 week", topics: ["Git", "Branching", "Merging"] },
      { id: 3, title: "CI/CD Pipelines", description: "Continuous Integration and Deployment", type: "core", resources: 2, estimatedTime: "2 weeks", topics: ["Jenkins", "GitHub Actions", "GitLab CI"] },
      { id: 4, title: "Containers & Docker", description: "Containerization with Docker", type: "core", resources: 2, estimatedTime: "2 weeks", topics: ["Docker", "Images", "Compose"] },
      { id: 5, title: "Orchestration & Kubernetes", description: "Kubernetes for orchestration", type: "core", resources: 2, estimatedTime: "2 weeks", topics: ["Kubernetes", "Pods", "Services"] },
      { id: 6, title: "Infrastructure as Code", description: "Automate infra with Terraform", type: "advanced", resources: 2, estimatedTime: "2 weeks", topics: ["Terraform", "CloudFormation"] },
      { id: 7, title: "Monitoring & Logging", description: "Monitor and log systems", type: "advanced", resources: 2, estimatedTime: "2 weeks", topics: ["Prometheus", "Grafana", "ELK"] },
      { id: 8, title: "Security & Compliance", description: "Security best practices", type: "final", resources: 1, estimatedTime: "1 week", topics: ["IAM", "VPC", "Secrets management"] }
    ]
  },
  7: {
    id: 7,
    title: "Android Developer",
    category: "Mobile Development",
    description: "Build native Android applications with Kotlin",
    icon: "Smartphone",
    difficulty: "Intermediate",
    duration: "6-8 months",
    skills: ["Kotlin", "Android Studio", "Jetpack", "Firebase"],
    color: "from-red-600 to-orange-500",
    lastUpdated: "December 15, 2024",
    totalSteps: 8,
    steps: [
      { id: 1, title: "Kotlin Basics", description: "Learn Kotlin syntax and basics", type: "foundation", resources: 2, estimatedTime: "2 weeks", topics: ["Variables", "Functions", "Classes"] },
      { id: 2, title: "Android Studio", description: "Setup and use Android Studio", type: "tool", resources: 1, estimatedTime: "1 week", topics: ["IDE", "Emulator", "Gradle"] },
      { id: 3, title: "UI Design", description: "Layouts and UI components", type: "core", resources: 2, estimatedTime: "2 weeks", topics: ["XML", "Views", "RecyclerView"] },
      { id: 4, title: "Activity & Fragment", description: "App structure and navigation", type: "core", resources: 2, estimatedTime: "2 weeks", topics: ["Activity", "Fragment", "Navigation"] },
      { id: 5, title: "Data Storage", description: "Store data locally", type: "core", resources: 2, estimatedTime: "2 weeks", topics: ["Room", "SharedPreferences"] },
      { id: 6, title: "Networking", description: "APIs and networking", type: "advanced", resources: 2, estimatedTime: "2 weeks", topics: ["Retrofit", "Volley", "REST"] },
      { id: 7, title: "Firebase Integration", description: "Add Firebase to your app", type: "enhancement", resources: 2, estimatedTime: "2 weeks", topics: ["Authentication", "Database", "Push notifications"] },
      { id: 8, title: "Publishing App", description: "Publish to Play Store", type: "final", resources: 1, estimatedTime: "1 week", topics: ["Signing", "Play Store", "Release"] }
    ]
  },
  8: {
    id: 8,
    title: "Flutter Developer",
    category: "Mobile Development",
    description: "Build cross-platform apps with Flutter and Dart",
    icon: "Smartphone",
    difficulty: "Intermediate",
    duration: "6-8 months",
    skills: ["Dart", "Flutter", "Firebase", "UI Design"],
    color: "from-blue-500 to-purple-600",
    lastUpdated: "December 15, 2024",
    totalSteps: 8,
    steps: [
      { id: 1, title: "Dart Basics", description: "Learn Dart language basics", type: "foundation", resources: 2, estimatedTime: "2 weeks", topics: ["Variables", "Functions", "Classes"] },
      { id: 2, title: "Flutter Setup", description: "Install and configure Flutter", type: "tool", resources: 1, estimatedTime: "1 week", topics: ["SDK", "IDE", "Emulator"] },
      { id: 3, title: "Widgets & Layouts", description: "Flutter UI basics", type: "core", resources: 2, estimatedTime: "2 weeks", topics: ["Widgets", "Layouts", "Material Design"] },
      { id: 4, title: "State Management", description: "Manage app state", type: "core", resources: 2, estimatedTime: "2 weeks", topics: ["Provider", "Bloc", "SetState"] },
      { id: 5, title: "Navigation & Routing", description: "App navigation", type: "core", resources: 2, estimatedTime: "2 weeks", topics: ["Navigator", "Routes", "Deep linking"] },
      { id: 6, title: "APIs & Networking", description: "Connect to APIs", type: "advanced", resources: 2, estimatedTime: "2 weeks", topics: ["HTTP", "Dio", "REST"] },
      { id: 7, title: "Firebase Integration", description: "Add Firebase to your app", type: "enhancement", resources: 2, estimatedTime: "2 weeks", topics: ["Authentication", "Database", "Push notifications"] },
      { id: 8, title: "Publishing App", description: "Publish to Play Store/App Store", type: "final", resources: 1, estimatedTime: "1 week", topics: ["Signing", "Release", "Stores"] }
    ]
  },
  9: {
    id: 9,
    title: "iOS Developer",
    category: "Mobile Development",
    description: "Create iOS apps with Swift and SwiftUI",
    icon: "Smartphone",
    difficulty: "Intermediate",
    duration: "6-8 months",
    skills: ["Swift", "SwiftUI", "Xcode", "Core Data"],
    color: "from-orange-500 to-red-500",
    lastUpdated: "December 15, 2024",
    totalSteps: 8,
    steps: [
      { id: 1, title: "Swift Basics", description: "Learn Swift language basics", type: "foundation", resources: 2, estimatedTime: "2 weeks", topics: ["Variables", "Functions", "Classes"] },
      { id: 2, title: "Xcode Setup", description: "Install and use Xcode", type: "tool", resources: 1, estimatedTime: "1 week", topics: ["IDE", "Simulator", "Playgrounds"] },
      { id: 3, title: "UI Design", description: "SwiftUI and UIKit basics", type: "core", resources: 2, estimatedTime: "2 weeks", topics: ["SwiftUI", "UIKit", "Views"] },
      { id: 4, title: "Navigation & Data Flow", description: "App navigation and data", type: "core", resources: 2, estimatedTime: "2 weeks", topics: ["NavigationView", "Passing data"] },
      { id: 5, title: "Persistence", description: "Store data locally", type: "core", resources: 2, estimatedTime: "2 weeks", topics: ["Core Data", "UserDefaults"] },
      { id: 6, title: "Networking", description: "APIs and networking", type: "advanced", resources: 2, estimatedTime: "2 weeks", topics: ["URLSession", "REST", "JSON"] },
      { id: 7, title: "App Store Integration", description: "Prepare for App Store", type: "enhancement", resources: 2, estimatedTime: "2 weeks", topics: ["App Store Connect", "TestFlight"] },
      { id: 8, title: "Publishing App", description: "Publish to App Store", type: "final", resources: 1, estimatedTime: "1 week", topics: ["Signing", "Release", "App Store"] }
    ]
  },
  10: {
    id: 10,
    title: "Machine Learning",
    category: "Languages / Platforms",
    description: "Learn AI/ML fundamentals and practical applications",
    icon: "Brain",
    difficulty: "Advanced",
    duration: "12-15 months",
    skills: ["Python", "TensorFlow", "PyTorch", "Statistics"],
    color: "from-orange-600 to-red-600",
    lastUpdated: "December 15, 2024",
    totalSteps: 8,
    steps: [
      { id: 1, title: "Python for ML", description: "Python basics for ML", type: "foundation", resources: 2, estimatedTime: "2 weeks", topics: ["Python", "Numpy", "Pandas"] },
      { id: 2, title: "Math for ML", description: "Linear algebra, calculus, stats", type: "foundation", resources: 2, estimatedTime: "2 weeks", topics: ["Linear Algebra", "Calculus", "Statistics"] },
      { id: 3, title: "Data Preprocessing", description: "Clean and prepare data", type: "core", resources: 2, estimatedTime: "2 weeks", topics: ["Cleaning", "Feature engineering"] },
      { id: 4, title: "Supervised Learning", description: "Regression and classification", type: "core", resources: 2, estimatedTime: "2 weeks", topics: ["Regression", "Classification"] },
      { id: 5, title: "Unsupervised Learning", description: "Clustering and dimensionality reduction", type: "core", resources: 2, estimatedTime: "2 weeks", topics: ["Clustering", "PCA"] },
      { id: 6, title: "Deep Learning", description: "Neural networks and frameworks", type: "advanced", resources: 2, estimatedTime: "2 weeks", topics: ["Neural Networks", "TensorFlow", "PyTorch"] },
      { id: 7, title: "Model Deployment", description: "Deploy ML models", type: "enhancement", resources: 2, estimatedTime: "2 weeks", topics: ["Flask", "FastAPI", "Cloud deployment"] },
      { id: 8, title: "Capstone Project", description: "Build and deploy an ML project", type: "final", resources: 1, estimatedTime: "2 weeks", topics: ["Project planning", "Implementation", "Deployment"] }
    ]
  }
};

export const getAllRoadmaps = () => {
  return Object.values(roadmapData);
};

export const getRoadmapById = (id) => {
  return roadmapData[id];
}; 