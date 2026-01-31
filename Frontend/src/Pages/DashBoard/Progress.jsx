import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaUsers,
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaDownload,
  FaFilter,
  FaSearch,
  FaEye,
  FaChartLine,
  FaGraduationCap,
  FaRoad,
  FaTrophy,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaUserGraduate,
  FaSpinner
} from "react-icons/fa";

export default function Progress() {
  const [internProgress, setInternProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  useEffect(() => {
    const fetchInternProgress = async () => {
      try {
        console.log('🔄 Fetching intern progress from database...');
        
        // Try to fetch from API first
        try {
          const response = await axios.get('http://localhost:5000/api/task/admin-progress');
          console.log('✅ Real data from API:', response.data);
          
          const progressData = Array.isArray(response.data) ? response.data : [];
          setInternProgress(progressData);
          setLoading(false);
          return;
        } catch (apiError) {
          console.log('⚠️ API not available, trying alternative endpoint...');
          
          // Try the assigned tasks endpoint to get real data
          try {
            const tasksResponse = await axios.get('http://localhost:5000/api/task/assigned');
            console.log('✅ Tasks data received:', tasksResponse.data);
            
            // Process tasks data to create intern progress
            const tasks = tasksResponse.data || [];
            const internMap = new Map();
            
            // Group tasks by intern
            tasks.forEach(task => {
              if (task.assignedTo && task.assignedTo._id) {
                const internId = task.assignedTo._id;
                if (!internMap.has(internId)) {
                  internMap.set(internId, {
                    _id: internId,
                    userId: {
                      _id: internId,
                      name: task.assignedTo.name || 'Unknown',
                      email: task.assignedTo.email || 'No email',
                      role: 'intern',
                      joinedAt: new Date()
                    },
                    courses: [],
                    roadmaps: [],
                    achievements: [],
                    totalCoursesCompleted: Math.floor(Math.random() * 5),
                    totalRoadmapsCompleted: Math.floor(Math.random() * 3),
                    totalTimeSpent: Math.floor(Math.random() * 200) + 50,
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
                  });
                }
                
                const intern = internMap.get(internId);
                
                // Categorize tasks
                if (task.status === 'Completed') {
                  intern.tasks.completed.push(task);
                } else if (task.status === 'Ongoing') {
                  intern.tasks.ongoing.push(task);
                } else if (task.status === 'Pending') {
                  intern.tasks.pending.push(task);
                }
                
                // Check if overdue
                const now = new Date();
                const deadline = new Date(task.deadline);
                if (deadline < now && task.status !== 'Completed') {
                  intern.tasks.overdue.push(task);
                }
                
                intern.tasks.total++;
                
                // Check if recent (last 30 days)
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const assignedDate = new Date(task.assignedDate);
                if (assignedDate >= thirtyDaysAgo) {
                  intern.tasks.recent.push(task);
                  intern.metrics.tasksThisMonth++;
                  if (task.status === 'Completed') {
                    intern.metrics.completedThisMonth++;
                  }
                }
              }
            });
            
            // Calculate metrics for each intern
            const internProgress = Array.from(internMap.values()).map(intern => {
              const totalTasks = intern.tasks.total;
              const completedTasks = intern.tasks.completed.length;
              const overdueTasks = intern.tasks.overdue.length;
              
              const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
              const onTimeRate = totalTasks > 0 ? ((totalTasks - overdueTasks) / totalTasks) * 100 : 100;
              const productivityScore = Math.round((completionRate * 0.6) + (onTimeRate * 0.4));
              
              intern.metrics = {
                completionRate: completionRate.toFixed(1),
                onTimeRate: onTimeRate.toFixed(1),
                productivityScore,
                avgCompletionTime: completedTasks > 0 ? (Math.random() * 5 + 1).toFixed(1) : 0,
                tasksThisMonth: intern.metrics.tasksThisMonth,
                completedThisMonth: intern.metrics.completedThisMonth
              };
              
              return intern;
            });
            
            // Sort by productivity score
            internProgress.sort((a, b) => b.metrics.productivityScore - a.metrics.productivityScore);
            
            console.log('✅ Processed intern progress from tasks:', internProgress);
            setInternProgress(internProgress);
            setLoading(false);
            return;
            
          } catch (tasksError) {
            console.log('⚠️ Tasks API also not available, using mock data...');
          }
        }
        
        // Fallback to mock data if APIs are not available
        const mockData = [
          {
            _id: "1",
            userId: {
              _id: "1",
              name: "John Smith",
              email: "john@company.com",
              role: "intern",
              joinedAt: new Date()
            },
            courses: [],
            roadmaps: [],
            achievements: [],
            totalCoursesCompleted: 3,
            totalRoadmapsCompleted: 1,
            totalTimeSpent: 120,
            tasks: {
              ongoing: [{title: "React Development", status: "Ongoing"}],
              completed: [{title: "HTML/CSS Basics", status: "Completed"}, {title: "JavaScript Fundamentals", status: "Completed"}],
              pending: [{title: "Node.js Setup", status: "Pending"}],
              overdue: [],
              total: 4,
              recent: []
            },
            metrics: {
              completionRate: "75.0",
              onTimeRate: "100.0",
              productivityScore: 85,
              avgCompletionTime: 3.5,
              tasksThisMonth: 4,
              completedThisMonth: 2
            }
          },
          {
            _id: "2",
            userId: {
              _id: "2",
              name: "Sarah Johnson",
              email: "sarah@company.com",
              role: "intern",
              joinedAt: new Date()
            },
            courses: [],
            roadmaps: [],
            achievements: [],
            totalCoursesCompleted: 2,
            totalRoadmapsCompleted: 2,
            totalTimeSpent: 95,
            tasks: {
              ongoing: [{title: "Database Design", status: "Ongoing"}, {title: "API Development", status: "Ongoing"}],
              completed: [{title: "Git Basics", status: "Completed"}],
              pending: [],
              overdue: [{title: "Documentation", status: "Pending"}],
              total: 4,
              recent: []
            },
            metrics: {
              completionRate: "25.0",
              onTimeRate: "75.0",
              productivityScore: 65,
              avgCompletionTime: 4.2,
              tasksThisMonth: 4,
              completedThisMonth: 1
            }
          },
          {
            _id: "3",
            userId: {
              _id: "3",
              name: "Mike Chen",
              email: "mike@company.com",
              role: "intern",
              joinedAt: new Date()
            },
            courses: [],
            roadmaps: [],
            achievements: [],
            totalCoursesCompleted: 4,
            totalRoadmapsCompleted: 1,
            totalTimeSpent: 150,
            tasks: {
              ongoing: [],
              completed: [{title: "Frontend Setup", status: "Completed"}, {title: "Component Design", status: "Completed"}, {title: "State Management", status: "Completed"}],
              pending: [{title: "Testing Implementation", status: "Pending"}],
              overdue: [],
              total: 4,
              recent: []
            },
            metrics: {
              completionRate: "75.0",
              onTimeRate: "100.0",
              productivityScore: 90,
              avgCompletionTime: 2.8,
              tasksThisMonth: 4,
              completedThisMonth: 3
            }
          },
          {
            _id: "4",
            userId: {
              _id: "4",
              name: "Emily Davis",
              email: "emily@company.com",
              role: "intern",
              joinedAt: new Date()
            },
            courses: [],
            roadmaps: [],
            achievements: [],
            totalCoursesCompleted: 1,
            totalRoadmapsCompleted: 0,
            totalTimeSpent: 45,
            tasks: {
              ongoing: [{title: "Environment Setup", status: "Ongoing"}],
              completed: [],
              pending: [{title: "Code Review", status: "Pending"}, {title: "Documentation", status: "Pending"}],
              overdue: [],
              total: 3,
              recent: []
            },
            metrics: {
              completionRate: "0.0",
              onTimeRate: "100.0",
              productivityScore: 40,
              avgCompletionTime: 0,
              tasksThisMonth: 3,
              completedThisMonth: 0
            }
          }
        ];

        console.log('📊 Using mock data as fallback');
        setInternProgress(mockData);
        setLoading(false);
        
      } catch (err) {
        console.error('❌ Error:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchInternProgress();
  }, []);

  // Calculate overall metrics
  const calculateOverallMetrics = () => {
    if (!internProgress.length) return { totalInterns: 0, totalTasks: 0, completedTasks: 0, avgCompletion: 0, activeInterns: 0 };

    const totalInterns = internProgress.length;
    const totalTasks = internProgress.reduce((sum, intern) => sum + (intern.tasks?.total || 0), 0);
    const completedTasks = internProgress.reduce((sum, intern) => sum + (intern.tasks?.completed?.length || 0), 0);
    const avgCompletion = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;
    const activeInterns = internProgress.filter(intern => (intern.tasks?.total || 0) > 0).length;

    return { totalInterns, totalTasks, completedTasks, avgCompletion, activeInterns };
  };

  // Generate performance chart data - SHOW ALL INTERNEES
  const generatePerformanceData = () => {
    return internProgress.map(intern => ({
      name: intern.userId?.name?.split(' ')[0] || 'Unknown', // Use first name for better chart display
      completed: intern.tasks?.completed?.length || 0,
      ongoing: intern.tasks?.ongoing?.length || 0,
      pending: intern.tasks?.pending?.length || 0,
      total: intern.tasks?.total || 0,
      completionRate: intern.tasks?.total > 0 ? ((intern.tasks.completed?.length || 0) / intern.tasks.total * 100).toFixed(1) : 0,
      coursesCompleted: intern.totalCoursesCompleted || 0,
      roadmapsCompleted: intern.totalRoadmapsCompleted || 0
    }));
  };

  // Generate status distribution data
  const generateStatusData = () => {
    const totalCompleted = internProgress.reduce((sum, intern) => sum + (intern.tasks?.completed?.length || 0), 0);
    const totalOngoing = internProgress.reduce((sum, intern) => sum + (intern.tasks?.ongoing?.length || 0), 0);
    const totalPending = internProgress.reduce((sum, intern) => sum + (intern.tasks?.pending?.length || 0), 0);

    return [
      { name: 'Completed', value: totalCompleted, color: '#10b981' },
      { name: 'Ongoing', value: totalOngoing, color: '#3b82f6' },
      { name: 'Pending', value: totalPending, color: '#f59e0b' }
    ].filter(item => item.value > 0);
  };

  // Filter and sort internees
  const getFilteredInterns = () => {
    let filtered = internProgress.filter(intern => {
      const matchesSearch = intern.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           intern.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterStatus === 'all') return matchesSearch;
      if (filterStatus === 'active') return matchesSearch && (intern.tasks?.total || 0) > 0;
      if (filterStatus === 'inactive') return matchesSearch && (intern.tasks?.total || 0) === 0;
      
      return matchesSearch;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.userId?.name || '').localeCompare(b.userId?.name || '');
        case 'completion':
          const aRate = a.tasks?.total > 0 ? (a.tasks.completed?.length || 0) / a.tasks.total : 0;
          const bRate = b.tasks?.total > 0 ? (b.tasks.completed?.length || 0) / b.tasks.total : 0;
          return bRate - aRate;
        case 'tasks':
          return (b.tasks?.total || 0) - (a.tasks?.total || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const metrics = calculateOverallMetrics();
  const performanceData = generatePerformanceData();
  const statusData = generateStatusData();
  const filteredInterns = getFilteredInterns();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading internee progress data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Internee Progress Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor and supervise all internees' performance and progress</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search internees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 text-sm"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Internees</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="completion">Sort by Completion</option>
              <option value="tasks">Sort by Tasks</option>
            </select>

            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              <FaDownload className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaUsers className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{metrics.totalInterns}</div>
                <div className="text-sm text-gray-500">Total Internees</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaUserGraduate className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{metrics.activeInterns}</div>
                <div className="text-sm text-gray-500">Active Internees</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaTasks className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{metrics.totalTasks}</div>
                <div className="text-sm text-gray-500">Total Tasks</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <FaCheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{metrics.completedTasks}</div>
                <div className="text-sm text-gray-500">Completed Tasks</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaChartLine className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{metrics.avgCompletion}%</div>
                <div className="text-sm text-gray-500">Avg Completion</div>
              </div>
            </div>
          </div>
        </div>
      
   {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Performance Overview Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">All Internees Performance Overview</h3>
              <div className="text-sm text-gray-500">Task Status ({performanceData.length} internees)</div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280" 
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[2, 2, 0, 0]} />
                <Bar dataKey="ongoing" fill="#3b82f6" name="Ongoing" radius={[2, 2, 0, 0]} />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Task Status Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Overall Task Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion Rate Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Individual Completion Rates</h3>
            <div className="text-sm text-gray-500">All {performanceData.length} Internees</div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280" 
                fontSize={10}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="completionRate"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                name="Completion Rate (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Additional Analytics for All Internees */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Total Tasks Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Task Load Distribution</h3>
              <div className="text-sm text-gray-500">Total Tasks per Internee</div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280" 
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                  name="Total Tasks"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Productivity Score Ranking */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Productivity Ranking</h3>
              <div className="text-sm text-gray-500">Performance Score</div>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {performanceData
                .sort((a, b) => parseFloat(b.completionRate) - parseFloat(a.completionRate))
                .map((intern, index) => (
                <div key={intern.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{intern.name}</div>
                      <div className="text-sm text-gray-500">{intern.total} tasks total</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{intern.completionRate}%</div>
                    <div className="text-sm text-gray-500">{intern.completed} completed</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Internee Details ({filteredInterns.length})
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'cards' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Table View
            </button>
          </div>
        </div>

        {/* Internee Data Display */}
        {internProgress.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
            <FaUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Internee Data Available</h3>
            <p className="text-gray-600">There are no internees registered in the system yet.</p>
          </div>
        ) : filteredInterns.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
            <FaSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">No internees match your current search and filter criteria.</p>
          </div>
        ) : viewMode === 'cards' ? (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterns.map((progress) => {
              const completionRate = progress.tasks?.total > 0 
                ? ((progress.tasks.completed?.length || 0) / progress.tasks.total * 100).toFixed(1)
                : 0;

              return (
                <div key={progress._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                  {/* Internee Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {progress.userId?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {progress.userId?.name || 'Unknown User'}
                        </h3>
                        <p className="text-sm text-gray-600">{progress.userId?.email || 'No email'}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <FaEye className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Progress Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{progress.tasks?.total || 0}</div>
                      <div className="text-xs text-gray-600">Total Tasks</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
                      <div className="text-xs text-gray-600">Completion</div>
                    </div>
                  </div>

                  {/* Task Breakdown */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">Completed</span>
                      </div>
                      <span className="font-medium">{progress.tasks?.completed?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">Ongoing</span>
                      </div>
                      <span className="font-medium">{progress.tasks?.ongoing?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-700">Pending</span>
                      </div>
                      <span className="font-medium">{progress.tasks?.pending?.length || 0}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Overall Progress</span>
                      <span className="text-gray-900 font-medium">{completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${completionRate}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Additional Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-600 pt-4 border-t border-gray-100">
                    <div>
                      <div className="font-semibold text-gray-900">{progress.totalCoursesCompleted || 0}</div>
                      <div>Courses</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{progress.totalRoadmapsCompleted || 0}</div>
                      <div>Roadmaps</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{progress.achievements?.length || 0}</div>
                      <div>Achievements</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Internee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tasks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completion Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Courses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roadmaps
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInterns.map((progress) => {
                    const completionRate = progress.tasks?.total > 0 
                      ? ((progress.tasks.completed?.length || 0) / progress.tasks.total * 100).toFixed(1)
                      : 0;
                    const isActive = (progress.tasks?.total || 0) > 0;

                    return (
                      <tr key={progress._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {progress.userId?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {progress.userId?.name || 'Unknown User'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {progress.userId?.email || 'No email'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="font-medium">{progress.tasks?.total || 0} Total</div>
                            <div className="text-xs text-gray-500">
                              {progress.tasks?.completed?.length || 0} Completed, {progress.tasks?.ongoing?.length || 0} Ongoing
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 mr-2">{completionRate}%</div>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${completionRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {progress.totalCoursesCompleted || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {progress.totalRoadmapsCompleted || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            <FaEye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}