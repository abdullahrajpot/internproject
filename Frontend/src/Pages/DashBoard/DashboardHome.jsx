import React, { useEffect, useState, useMemo } from 'react';
import { useUsers } from '../../Contexts/UserContext';
import {
  FaUsers,
  FaUserGraduate,
  FaTasks,
  FaPlus,
  FaUserEdit,
  FaClipboardList,
  FaArrowLeft,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowUp,
  FaBell,
  FaDownload,
  FaFilter
} from 'react-icons/fa';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function DashboardHome() {
  const navigate = useNavigate();
  const { users, getUsersByRole, loading: usersLoading } = useUsers() || {};
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [analytics, setAnalytics] = useState({
    users: { total: 0, internees: 0, admins: 0, regularUsers: 0, growth: { users: 0, internees: 0 } },
    tasks: { total: 0, completed: 0, pending: 0, overdue: 0, completionRate: 0, growth: 0 },
    roleDistribution: []
  });
  const [timeFilter, setTimeFilter] = useState('7d');
  const [taskTrends, setTaskTrends] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [timeFilter]);

  // Fetch all dashboard data from backend APIs
  const fetchDashboardData = async () => {
    setTasksLoading(true);
    setAnalyticsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch analytics data
      const analyticsResponse = await axios.get('http://localhost:5000/api/analytics/dashboard', { headers });
      if (analyticsResponse.data.success) {
        setAnalytics(analyticsResponse.data.data);
      }

      // Fetch task trends
      const trendsResponse = await axios.get('http://localhost:5000/api/analytics/task-trends', { headers });
      if (trendsResponse.data.success) {
        setTaskTrends(trendsResponse.data.data);
      }

      // Fetch system notifications
      const notificationsResponse = await axios.get('http://localhost:5000/api/analytics/notifications', { headers });
      if (notificationsResponse.data.success) {
        setNotifications(notificationsResponse.data.data);
      }

      // Fetch tasks for recent activity
      const tasksResponse = await axios.get('http://localhost:5000/api/task/assigned', { headers });
      setTasks(tasksResponse.data || []);

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);

      // Fallback to sample data if API fails
      setAnalytics({
        users: { total: 0, internees: 0, admins: 0, regularUsers: 0, growth: { users: 0, internees: 0 } },
        tasks: { total: 0, completed: 0, pending: 0, overdue: 0, completionRate: 0, growth: 0 },
        roleDistribution: []
      });
      setTaskTrends([]);
      setNotifications([]);
      setTasks([]);
    } finally {
      setTasksLoading(false);
      setAnalyticsLoading(false);
    }
  };

  // Enhanced user role distribution for chart - now using real data
  const roleData = useMemo(() => {
    if (analytics.roleDistribution && analytics.roleDistribution.length > 0) {
      return analytics.roleDistribution;
    }

    // Fallback to users context if analytics not loaded
    if (!users) return [];
    const admin = users.filter(u => u.role === 'admin').length;
    const intern = users.filter(u => u.role === 'intern').length;
    const user = users.filter(u => u.role === 'user').length;
    return [
      { name: 'Admins', value: admin, color: '#3B82F6' },
      { name: 'Internees', value: intern, color: '#10B981' },
      { name: 'Users', value: user, color: '#F59E0B' },
    ];
  }, [analytics.roleDistribution, users]);

  // Enhanced recent activity with more details - using real data
  useEffect(() => {
    if (!users || !tasks) return;
    const recentUsers = [...users].reverse().slice(0, 3).map(u => ({
      type: 'user',
      icon: 'user',
      text: `${u.name} joined as ${u.role}`,
      date: u.dateCreated || u.createdAt || '',
      priority: 'low'
    }));
    const recentTasks = [...tasks].reverse().slice(0, 4).map(t => ({
      type: 'task',
      icon: 'task',
      text: `Task '${t.title}' assigned to ${t.assignedTo?.name || 'Unknown'}`,
      date: t.assignedDate || t.createdAt || '',
      priority: new Date(t.deadline) < new Date() ? 'high' : 'medium'
    }));
    setRecentActivity([...recentUsers, ...recentTasks]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8));
  }, [users, tasks]);

  // Calculate key metrics from real data
  const totalUsers = analytics.users?.total || (users ? users.length : 0);
  const totalInternees = analytics.users?.internees || (getUsersByRole ? getUsersByRole('intern').length : 0);
  const totalTasks = analytics.tasks?.total || (tasks ? tasks.length : 0);
  const completedTasks = analytics.tasks?.completed || (tasks ? tasks.filter(t => t.status === 'Completed').length : 0);
  const pendingTasks = analytics.tasks?.pending || (totalTasks - completedTasks);
  const overdueTasks = analytics.tasks?.overdue || (tasks ? tasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'Completed').length : 0);

  // Real growth calculations from backend
  const userGrowth = analytics.users?.growth?.users || 0;
  const interneeGrowth = analytics.users?.growth?.internees || 0;
  const taskGrowth = analytics.tasks?.growth || 0;
  const completionRate = analytics.tasks?.completionRate || 0;
  const completionGrowth = analytics.tasks?.completionGrowth || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back to Home</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <FaDownload className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <FaFilter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Welcome back, Admin!</h2>
                <p className="text-blue-100 text-lg">Here's what's happening with your platform today.</p>
              </div>
              <div className="mt-6 lg:mt-0 flex flex-wrap gap-3">
                <Link
                  to="/dashboard/users"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 hover:scale-105"
                >
                  <FaUsers className="w-4 h-4" />
                  <span>Manage Users</span>
                </Link>
                <Link
                  to="/dashboard/internees"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 hover:scale-105"
                >
                  <FaUserGraduate className="w-4 h-4" />
                  <span>View Internees</span>
                </Link>
                <Link
                  to="/dashboard/assign-task"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 hover:scale-105"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Assign Task</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analyticsLoading ? <span className="animate-pulse">...</span> : totalUsers.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <FaArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+{userGrowth}%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <FaUsers className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Internees Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Internees</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analyticsLoading ? <span className="animate-pulse">...</span> : totalInternees.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <FaArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+{interneeGrowth}%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <FaUserGraduate className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Tasks Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {tasksLoading ? <span className="animate-pulse">...</span> : totalTasks.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <FaArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+{taskGrowth}%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <FaTasks className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Completion Rate Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {tasksLoading ? <span className="animate-pulse">...</span> : `${completionRate}%`}
                </p>
                <div className="flex items-center mt-2">
                  <FaArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+{completionGrowth}%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <FaCheckCircle className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Task Trends Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Task Trends</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Assigned</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={taskTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area type="monotone" dataKey="assigned" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="completed" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="pending" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* User Distribution */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">User Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={5}
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row - Recent Activity and Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaClipboardList className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent activity</p>
                </div>
              ) : (
                recentActivity.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`p-2 rounded-full ${item.type === 'user' ? 'bg-blue-100' : 'bg-orange-100'
                      }`}>
                      {item.type === 'user' ?
                        <FaUserEdit className={`w-4 h-4 ${item.type === 'user' ? 'text-blue-600' : 'text-orange-600'}`} /> :
                        <FaClipboardList className={`w-4 h-4 ${item.type === 'user' ? 'text-blue-600' : 'text-orange-600'}`} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.text}</p>
                      <p className="text-xs text-gray-500">{item.date ? new Date(item.date).toLocaleDateString() : 'Recently'}</p>
                    </div>
                    {item.priority === 'high' && (
                      <div className="flex-shrink-0">
                        <FaExclamationTriangle className="w-4 h-4 text-red-500" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Stats & Notifications */}
          <div className="space-y-6">
            {/* Task Status Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{completedTasks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Pending</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{pendingTasks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Overdue</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{overdueTasks}</span>
                </div>
              </div>
            </div>

            {/* System Notifications */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <FaBell className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {notifications.slice(0, 4).map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notification.type === 'error' ? 'bg-red-500' :
                      notification.type === 'warning' ? 'bg-orange-500' :
                        notification.type === 'success' ? 'bg-green-500' :
                          'bg-blue-500'
                      }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 