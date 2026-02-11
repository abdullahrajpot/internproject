const User = require('../models/User');
const Task = require('../models/Task');
const UserProgress = require('../models/UserProgress');

// Helper to get dates for filtering
const getDateFilter = (timeFilter) => {
  const now = new Date();
  let startDate;
  switch (timeFilter) {
    case '7d':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case '30d':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case '90d':
      startDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    default:
      startDate = new Date(0); // Epoch time for all time
  }
  return startDate;
};

// @desc    Get dashboard analytics data
// @route   GET /api/analytics/dashboard
// @access  Admin
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const timeFilter = req.query.timeFilter || 'all';
    const startDate = getDateFilter(timeFilter);

    // User Analytics
    const totalUsers = await User.countDocuments();
    const internees = await User.countDocuments({ role: 'intern' });
    const admins = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });

    const newUsers = await User.countDocuments({ dateCreated: { $gte: startDate } });
    const newInternees = await User.countDocuments({ role: 'intern', dateCreated: { $gte: startDate } });
    
    const userGrowth = totalUsers > 0 ? ((newUsers / (totalUsers - newUsers)) * 100).toFixed(2) : 0;
    const interneeGrowth = internees > 0 ? ((newInternees / (internees - newInternees)) * 100).toFixed(2) : 0;

    // Task Analytics
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Completed' });
    const pendingTasks = await Task.countDocuments({ status: 'Pending' });
    const ongoingTasks = await Task.countDocuments({ status: 'Ongoing' });
    const overdueTasks = await Task.countDocuments({ deadline: { $lt: new Date() }, status: { $ne: 'Completed' } });

    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;

    const newTasks = await Task.countDocuments({ assignedDate: { $gte: startDate } });
    const taskGrowth = totalTasks > 0 ? ((newTasks / (totalTasks - newTasks)) * 100).toFixed(2) : 0;

    // Role Distribution
    const roleDistribution = [
      { name: 'Admins', value: admins, color: '#3B82F6' },
      { name: 'Internees', value: internees, color: '#10B981' },
      { name: 'Users', value: regularUsers, color: '#F59E0B' },
    ];

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          internees: internees,
          admins: admins,
          regularUsers: regularUsers,
          growth: { users: userGrowth, internees: interneeGrowth },
        },
        tasks: {
          total: totalTasks,
          completed: completedTasks,
          pending: pendingTasks,
          ongoing: ongoingTasks,
          overdue: overdueTasks,
          completionRate: completionRate,
          growth: taskGrowth,
        },
        roleDistribution,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get task trends data
// @route   GET /api/analytics/task-trends
// @access  Admin
exports.getTaskTrends = async (req, res) => {
  try {
    const trends = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const assigned = await Task.countDocuments({ assignedDate: { $gte: startOfDay, $lte: endOfDay } });
      const completed = await Task.countDocuments({ status: 'Completed', assignedDate: { $gte: startOfDay, $lte: endOfDay } });
      const pending = assigned - completed;

      trends.push({
        date: startOfDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        assigned,
        completed,
        pending,
      });
    }
    res.status(200).json({ success: true, data: trends });
  } catch (error) {
    console.error('Error fetching task trends:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get system notifications
// @route   GET /api/analytics/notifications
// @access  Admin
exports.getNotifications = async (req, res) => {
  try {
    const notifications = [];
    const overdueTasks = await Task.find({ deadline: { $lt: new Date() }, status: { $ne: 'Completed' } }).populate('assignedTo', 'name');
    overdueTasks.forEach(task => {
      notifications.push({
        id: task._id,
        type: 'warning',
        message: `Task '${task.title}' assigned to ${task.assignedTo ? task.assignedTo.name : 'Unknown'} is overdue!`, 
        time: `${Math.ceil((new Date() - new Date(task.deadline)) / (1000 * 60 * 60 * 24))} days ago`,
        priority: 'high'
      });
    });

    const recentInterns = await User.find({ role: 'intern', dateCreated: { $gte: new Date(new Date().setDate(new Date().getDate() - 1)) } });
    recentInterns.forEach(intern => {
        notifications.push({
            id: intern._id,
            type: 'success',
            message: `New internee ${intern.name} registered successfully.`, 
            time: 'Less than 24 hours ago',
            priority: 'low'
        });
    });

    notifications.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get comprehensive internee analytics
// @route   GET /api/analytics/internees
// @access  Admin
exports.getInterneeAnalytics = async (req, res) => {
  try {
    const internees = await User.find({ role: 'intern' }).select('name email dateCreated');
    const interneeAnalytics = [];

    for (const internee of internees) {
      // Get task statistics
      const totalTasks = await Task.countDocuments({ assignedTo: internee._id });
      const completedTasks = await Task.countDocuments({ assignedTo: internee._id, status: 'Completed' });
      const pendingTasks = await Task.countDocuments({ assignedTo: internee._id, status: 'Pending' });
      const ongoingTasks = await Task.countDocuments({ assignedTo: internee._id, status: 'Ongoing' });
      const overdueTasks = await Task.countDocuments({ 
        assignedTo: internee._id, 
        deadline: { $lt: new Date() }, 
        status: { $ne: 'Completed' } 
      });

      // Get course progress
      const userProgress = await UserProgress.findOne({ userId: internee._id });
      const coursesEnrolled = userProgress?.totalCoursesEnrolled || 0;
      const coursesCompleted = userProgress?.totalCoursesCompleted || 0;
      const roadmapsEnrolled = userProgress?.totalRoadmapsEnrolled || 0;
      const roadmapsCompleted = userProgress?.totalRoadmapsCompleted || 0;
      const totalTimeSpent = userProgress?.totalTimeSpent || 0;

      // Calculate completion rate
      const taskCompletionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;
      const courseCompletionRate = coursesEnrolled > 0 ? ((coursesCompleted / coursesEnrolled) * 100).toFixed(2) : 0;

      // Calculate overall progress score (weighted average)
      const overallProgress = totalTasks > 0 || coursesEnrolled > 0
        ? (((parseFloat(taskCompletionRate) * totalTasks) + (parseFloat(courseCompletionRate) * coursesEnrolled)) / 
           (totalTasks + coursesEnrolled)).toFixed(2)
        : 0;

      interneeAnalytics.push({
        id: internee._id,
        name: internee.name,
        email: internee.email,
        joinedDate: internee.dateCreated,
        tasks: {
          total: totalTasks,
          completed: completedTasks,
          pending: pendingTasks,
          ongoing: ongoingTasks,
          overdue: overdueTasks,
          completionRate: parseFloat(taskCompletionRate)
        },
        courses: {
          enrolled: coursesEnrolled,
          completed: coursesCompleted,
          completionRate: parseFloat(courseCompletionRate)
        },
        roadmaps: {
          enrolled: roadmapsEnrolled,
          completed: roadmapsCompleted
        },
        timeSpent: totalTimeSpent,
        overallProgress: parseFloat(overallProgress),
        status: overdueTasks > 0 ? 'needs-attention' : totalTasks === completedTasks && totalTasks > 0 ? 'excellent' : 'on-track'
      });
    }

    // Sort by overall progress (descending)
    interneeAnalytics.sort((a, b) => b.overallProgress - a.overallProgress);

    res.status(200).json({ success: true, data: interneeAnalytics });
  } catch (error) {
    console.error('Error fetching internee analytics:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get course completion analytics
// @route   GET /api/analytics/courses
// @access  Admin
exports.getCourseAnalytics = async (req, res) => {
  try {
    const allProgress = await UserProgress.find().populate('userId', 'name email role');
    
    // Aggregate course statistics
    const courseStats = {};
    
    allProgress.forEach(progress => {
      if (progress.userId && progress.userId.role === 'intern') {
        progress.courses.forEach(course => {
          if (!courseStats[course.courseId]) {
            courseStats[course.courseId] = {
              courseId: course.courseId,
              title: course.title,
              category: course.category,
              difficulty: course.difficulty,
              totalEnrolled: 0,
              totalCompleted: 0,
              averageProgress: 0,
              totalTimeSpent: 0,
              enrollments: []
            };
          }
          
          courseStats[course.courseId].totalEnrolled++;
          if (course.completed) {
            courseStats[course.courseId].totalCompleted++;
          }
          courseStats[course.courseId].averageProgress += course.progressPercentage;
          courseStats[course.courseId].totalTimeSpent += course.timeSpent;
          courseStats[course.courseId].enrollments.push({
            userName: progress.userId.name,
            progress: course.progressPercentage,
            completed: course.completed
          });
        });
      }
    });

    // Calculate averages
    const courseAnalytics = Object.values(courseStats).map(course => ({
      ...course,
      averageProgress: course.totalEnrolled > 0 
        ? (course.averageProgress / course.totalEnrolled).toFixed(2) 
        : 0,
      completionRate: course.totalEnrolled > 0 
        ? ((course.totalCompleted / course.totalEnrolled) * 100).toFixed(2) 
        : 0
    }));

    res.status(200).json({ success: true, data: courseAnalytics });
  } catch (error) {
    console.error('Error fetching course analytics:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get performance trends over time
// @route   GET /api/analytics/performance-trends
// @access  Admin
exports.getPerformanceTrends = async (req, res) => {
  try {
    const trends = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      // Tasks completed on this day
      const tasksCompleted = await Task.countDocuments({ 
        status: 'Completed',
        assignedDate: { $gte: startOfDay, $lte: endOfDay }
      });

      // New internees joined
      const newInternees = await User.countDocuments({
        role: 'intern',
        dateCreated: { $gte: startOfDay, $lte: endOfDay }
      });

      // Active internees (those with tasks or progress updates)
      const activeInternees = await Task.distinct('assignedTo', {
        assignedDate: { $lte: endOfDay }
      });

      trends.push({
        date: startOfDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tasksCompleted,
        newInternees,
        activeInternees: activeInternees.length
      });
    }

    res.status(200).json({ success: true, data: trends });
  } catch (error) {
    console.error('Error fetching performance trends:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get task distribution by status
// @route   GET /api/analytics/task-distribution
// @access  Admin
exports.getTaskDistribution = async (req, res) => {
  try {
    const completed = await Task.countDocuments({ status: 'Completed' });
    const ongoing = await Task.countDocuments({ status: 'Ongoing' });
    const pending = await Task.countDocuments({ status: 'Pending' });
    const overdue = await Task.countDocuments({ 
      deadline: { $lt: new Date() }, 
      status: { $ne: 'Completed' } 
    });

    const distribution = [
      { name: 'Completed', value: completed, color: '#10B981' },
      { name: 'Ongoing', value: ongoing, color: '#3B82F6' },
      { name: 'Pending', value: pending, color: '#F59E0B' },
      { name: 'Overdue', value: overdue, color: '#EF4444' }
    ];

    res.status(200).json({ success: true, data: distribution });
  } catch (error) {
    console.error('Error fetching task distribution:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
