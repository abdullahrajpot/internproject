import React, { useState, useEffect } from 'react';
import {
  FaChartLine,
  FaUsers,
  FaTasks,
  FaDownload,
  FaArrowUp,
  FaArrowDown,
  FaCheckCircle,
  FaSpinner,
  FaClock,
  FaGraduationCap,
  FaExclamationTriangle,
  FaTrophy
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  fetchInterneeAnalytics,
  fetchCourseAnalytics,
  fetchPerformanceTrends,
  fetchTaskDistribution,
  fetchAnalytics
} from '../../utils/api';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('7d');
  const [interneeData, setInterneeData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [performanceTrends, setPerformanceTrends] = useState([]);
  const [taskDistribution, setTaskDistribution] = useState([]);
  const [overallStats, setOverallStats] = useState(null);

  useEffect(() => {
    fetchAllAnalytics();
  }, [timeFilter]);

  const fetchAllAnalytics = async () => {
    setLoading(true);
    try {
      const [internees, courses, trends, distribution, overall] = await Promise.all([
        fetchInterneeAnalytics(),
        fetchCourseAnalytics(),
        fetchPerformanceTrends(),
        fetchTaskDistribution(),
        fetchAnalytics()
      ]);

      if (internees.success) setInterneeData(internees.data.data || []);
      if (courses.success) setCourseData(courses.data.data || []);
      if (trends.success) setPerformanceTrends(trends.data.data || []);
      if (distribution.success) setTaskDistribution(distribution.data.data || []);
      if (overall.success) setOverallStats(overall.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      timeFilter,
      interneeData,
      courseData,
      performanceTrends,
      taskDistribution,
      overallStats
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Calculate summary metrics
  const totalInternees = interneeData.length;
  const avgProgress = interneeData.length > 0
    ? (interneeData.reduce((sum, i) => sum + i.overallProgress, 0) / interneeData.length).toFixed(1)
    : 0;
  const totalTasksCompleted = interneeData.reduce((sum, i) => sum + i.tasks.completed, 0);
  const totalCoursesCompleted = interneeData.reduce((sum, i) => sum + i.courses.completed, 0);
  const interneesNeedingAttention = interneeData.filter(i => i.status === 'needs-attention').length;

  // Top performers
  const topPerformers = [...interneeData].slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive insights into internee performance and progress</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>

            <button
              onClick={exportReport}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <FaDownload className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Internees</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{totalInternees}</p>
                <div className="flex items-center mt-2">
                  <FaArrowUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">
                    {overallStats?.users?.growth?.internees || 0}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <FaUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{avgProgress}%</p>
                <div className="flex items-center mt-2">
                  <FaCheckCircle className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-sm text-gray-500">Overall completion</span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <FaChartLine className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{totalTasksCompleted}</p>
                <div className="flex items-center mt-2">
                  <FaTasks className="w-3 h-3 text-purple-500 mr-1" />
                  <span className="text-sm text-gray-500">Across all internees</span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <FaTasks className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Needs Attention</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{interneesNeedingAttention}</p>
                <div className="flex items-center mt-2">
                  <FaExclamationTriangle className="w-3 h-3 text-orange-500 mr-1" />
                  <span className="text-sm text-gray-500">Overdue tasks</span>
                </div>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <FaExclamationTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Trends */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceTrends}>
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
                <Legend />
                <Line type="monotone" dataKey="tasksCompleted" stroke="#10B981" strokeWidth={2} name="Tasks Completed" />
                <Line type="monotone" dataKey="activeInternees" stroke="#3B82F6" strokeWidth={2} name="Active Internees" />
                <Line type="monotone" dataKey="newInternees" stroke="#F59E0B" strokeWidth={2} name="New Internees" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Task Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Task Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Internee Performance Table */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Internee Performance Overview</h3>
            <span className="text-sm text-gray-500">{interneeData.length} total internees</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Internee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {interneeData.map((internee) => (
                  <tr key={internee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {internee.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{internee.name}</div>
                          <div className="text-sm text-gray-500">{internee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2" style={{ width: '100px' }}>
                          <div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                            style={{ width: `${internee.overallProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{internee.overallProgress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {internee.tasks.completed}/{internee.tasks.total}
                      </div>
                      <div className="text-xs text-gray-500">
                        {internee.tasks.completionRate}% complete
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {internee.courses.completed}/{internee.courses.enrolled}
                      </div>
                      <div className="text-xs text-gray-500">
                        {internee.courses.completionRate}% complete
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FaClock className="w-3 h-3 mr-1 text-gray-400" />
                        {internee.timeSpent} min
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${internee.status === 'excellent' ? 'bg-green-100 text-green-800' :
                          internee.status === 'on-track' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {internee.status === 'excellent' ? 'Excellent' :
                          internee.status === 'on-track' ? 'On Track' :
                            'Needs Attention'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performers */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
              <FaTrophy className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="space-y-4">
              {topPerformers.map((internee, index) => (
                <div key={internee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-600' :
                            'bg-blue-500'
                      }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{internee.name}</div>
                      <div className="text-xs text-gray-500">
                        {internee.tasks.completed} tasks • {internee.courses.completed} courses
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{internee.overallProgress}%</div>
                    <div className="text-xs text-gray-500">progress</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course Analytics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Course Completion Rates</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseData.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="title" stroke="#6b7280" fontSize={12} angle={-15} textAnchor="end" height={80} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="totalEnrolled" fill="#3B82F6" name="Enrolled" />
                <Bar dataKey="totalCompleted" fill="#10B981" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Details Table */}
        {courseData.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Course Analytics Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courseData.map((course) => (
                    <tr key={course.courseId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {course.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                            course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                          }`}>
                          {course.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.totalEnrolled}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.totalCompleted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${course.averageProgress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{course.averageProgress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {course.completionRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}