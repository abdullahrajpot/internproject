require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('./models/Resource');

const resourcesData = [
  {
    title: 'Company Handbook',
    description: 'Essential information about company culture, policies, and values.',
    category: 'General',
    link: 'https://example.com/company-handbook.pdf',
    fileType: 'pdf',
  },
  {
    title: 'Project Proposal Template',
    description: 'A template to help you structure your project proposals effectively.',
    category: 'Templates',
    link: 'https://example.com/project-proposal-template.doc',
    fileType: 'doc',
  },
  {
    title: 'Git & GitHub Basics Guide',
    description: 'A comprehensive guide for beginners to understand Git and GitHub.',
    category: 'Learning Guides',
    link: 'https://example.com/git-guide.pdf',
    fileType: 'pdf',
  },
  {
    title: 'Frontend Development Roadmap',
    description: 'A detailed roadmap for aspiring frontend developers.',
    category: 'Roadmaps',
    link: 'https://example.com/frontend-roadmap.pdf',
    fileType: 'pdf',
  },
  {
    title: 'Internship Program FAQ',
    description: 'Frequently asked questions about the internship program.',
    category: 'General',
    link: 'https://example.com/internship-faq.doc',
    fileType: 'doc',
  },
  {
    title: 'Backend API Documentation',
    description: 'Documentation for the platform\'s backend APIs.',
    category: 'Technical Docs',
    link: 'https://example.com/backend-api-docs.pdf',
    fileType: 'pdf',
  },
  {
    title: 'Effective Communication in the Workplace',
    description: 'Tips and strategies for clear and professional communication.',
    category: 'Learning Guides',
    link: 'https://example.com/communication-guide.pdf',
    fileType: 'pdf',
  },
  {
    title: 'Performance Review Template',
    description: 'Template for self-assessment and manager reviews.',
    category: 'Templates',
    link: 'https://example.com/performance-template.doc',
    fileType: 'doc',
  },
  {
    title: 'Onboarding Checklist',
    description: 'A checklist for new interns to get started smoothly.',
    category: 'General',
    link: 'https://example.com/onboarding-checklist.pdf',
    fileType: 'pdf',
  },
];

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/internship-platform');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedResources = async () => {
  await connectDB();
  try {
    await Resource.deleteMany();
    console.log('Existing resources deleted.');

    await Resource.insertMany(resourcesData);
    console.log('Resources seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error seeding resources: ${error.message}`);
    process.exit(1);
  }
};

seedResources();