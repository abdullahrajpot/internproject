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
    const timeFilter = req.query.timeFilter || 'all'; // Default to all time
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
      const pending = assigned - completed; // Simplified calculation for trends

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
    // Example: Add notifications for overdue tasks
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

    // Example: Add a success notification for recent intern registration (if any in last 24h)
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

    // Sort notifications by time (most recent first)
    notifications.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
