const UserProgress = require('../models/UserProgress');
const User = require('../models/User');
const Task = require('../models/Task');

// Get all intern progress
exports.getAllInternProgress = async (req, res) => {
  try {
    console.log('Fetching intern progress data...');

    // Get all users with intern role
    const interns = await User.find({ role: 'intern' }).select('name email role createdAt');
    console.log(`Found ${interns.length} interns`);
    
    if (interns.length === 0) {
      return res.status(200).json([]);
    }

    const detailedInternProgress = await Promise.all(interns.map(async (intern) => {
      try {
        // Get user progress for this intern
        let userProgress = await UserProgress.findOne({ userId: intern._id });
        
        // If no progress record exists, create a default one
        if (!userProgress) {
          userProgress = {
            userId: intern._id,
            courses: [],
            roadmaps: [],
            achievements: [],
            totalCoursesCompleted: 0,
            totalRoadmapsCompleted: 0,
            totalTimeSpent: 0
          };
        }

        // Get all tasks for this intern
        const tasks = await Task.find({ assignedTo: intern._id }).sort({ assignedDate: -1 });
        
        const ongoingTasks = tasks.filter(task => task.status === 'Ongoing');
        const completedTasks = tasks.filter(task => task.status === 'Completed');
        const pendingTasks = tasks.filter(task => task.status === 'Pending');

        // Calculate additional metrics
        const now = new Date();
        const overdueTasks = tasks.filter(task => {
          const deadline = new Date(task.deadline);
          return deadline < now && task.status !== 'Completed';
        });

        // Calculate productivity score (0-100)
        const totalTasks = tasks.length;
        const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;
        const onTimeRate = totalTasks > 0 ? ((totalTasks - overdueTasks.length) / totalTasks) * 100 : 100;
        const productivityScore = Math.round((completionRate * 0.6) + (onTimeRate * 0.4));

        // Get recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentTasks = tasks.filter(task => new Date(task.assignedDate) >= thirtyDaysAgo);

        return {
          _id: userProgress._id || intern._id,
          userId: {
            _id: intern._id,
            name: intern.name,
            email: intern.email,
            role: intern.role,
            joinedAt: intern.createdAt
          },
          courses: userProgress.courses || [],
          roadmaps: userProgress.roadmaps || [],
          achievements: userProgress.achievements || [],
          totalCoursesCompleted: userProgress.totalCoursesCompleted || 0,
          totalRoadmapsCompleted: userProgress.totalRoadmapsCompleted || 0,
          totalTimeSpent: userProgress.totalTimeSpent || 0,
          tasks: {
            ongoing: ongoingTasks,
            completed: completedTasks,
            pending: pendingTasks,
            overdue: overdueTasks,
            total: tasks.length,
            recent: recentTasks
          },
          metrics: {
            completionRate: completionRate.toFixed(1),
            onTimeRate: onTimeRate.toFixed(1),
            productivityScore,
            avgCompletionTime: 0,
            tasksThisMonth: recentTasks.length,
            completedThisMonth: recentTasks.filter(task => task.status === 'Completed').length
          }
        };
      } catch (internError) {
        console.error(`Error processing intern ${intern.name}:`, internError);
        return {
          _id: intern._id,
          userId: {
            _id: intern._id,
            name: intern.name,
            email: intern.email,
            role: intern.role,
            joinedAt: intern.createdAt
          },
          courses: [],
          roadmaps: [],
          achievements: [],
          totalCoursesCompleted: 0,
          totalRoadmapsCompleted: 0,
          totalTimeSpent: 0,
          tasks: {
            ongoing: [],
            completed: [],
            pending: [],
            overdue: [],
            total: 0,
            recent: []
          },
          metrics: {
            completionRate: '0',
            onTimeRate: '100',
            productivityScore: 0,
            avgCompletionTime: 0,
            tasksThisMonth: 0,
            completedThisMonth: 0
          }
        };
      }
    }));

    // Sort by productivity score (highest first)
    detailedInternProgress.sort((a, b) => b.metrics.productivityScore - a.metrics.productivityScore);

    console.log(`Returning progress data for ${detailedInternProgress.length} interns`);
    res.status(200).json(detailedInternProgress);
  } catch (error) {
    console.error('Error fetching intern progress:', error);
    res.status(500).json({ 
      message: 'Error fetching intern progress', 
      error: error.message
    });
  }
};

// Get analytics summary for admin dashboard
exports.getAnalyticsSummary = async (req, res) => {
  try {
    console.log('Fetching analytics summary...');
    
    const totalInterns = await User.countDocuments({ role: 'intern' });
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Completed' });
    const ongoingTasks = await Task.countDocuments({ status: 'Ongoing' });
    const pendingTasks = await Task.countDocuments({ status: 'Pending' });
    
    const now = new Date();
    const overdueTasks = await Task.countDocuments({
      deadline: { $lt: now },
      status: { $ne: 'Completed' }
    });

    // Get monthly task completion trend (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthlyCompleted = await Task.countDocuments({
        status: 'Completed',
        updatedAt: { $gte: startOfMonth, $lte: endOfMonth }
      });

      const monthlyTotal = await Task.countDocuments({
        assignedDate: { $gte: startOfMonth, $lte: endOfMonth }
      });

      monthlyData.push({
        month: startOfMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        completed: monthlyCompleted,
        total: monthlyTotal,
        completionRate: monthlyTotal > 0 ? ((monthlyCompleted / monthlyTotal) * 100).toFixed(1) : 0
      });
    }

    const summary = {
      overview: {
        totalInterns,
        totalTasks,
        completedTasks,
        ongoingTasks,
        pendingTasks,
        overdueTasks,
        completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0,
        onTimeRate: totalTasks > 0 ? (((totalTasks - overdueTasks) / totalTasks) * 100).toFixed(1) : 100
      },
      trends: {
        monthly: monthlyData
      }
    };

    console.log('Analytics summary generated successfully');
    res.status(200).json(summary);
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    res.status(500).json({ 
      message: 'Error fetching analytics summary', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
