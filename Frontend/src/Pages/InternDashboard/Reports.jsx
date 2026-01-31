import React, { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import axios from "axios";
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
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaDownload,
  FaFilter,
  FaShare,
  FaChartLine,
  FaChartPie,
  FaChartBar,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";

const Reports = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("last30days");

  useEffect(() => {
    if (user?.id || user?._id) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/api/task/assigned?internId=${user.id || user._id}`)
        .then((res) => {
          const internTasks = res.data.filter(task => {
            const userId = user.id || user._id;
            const taskAssignedTo = task.assignedTo?._id || task.assignedTo?.id;
            return taskAssignedTo === userId || task.internId === userId;
          });
          setTasks(internTasks);
        })
        .catch((error) => {
          console.error('Error fetching tasks:', error);
          setTasks([]);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  // Calculate metrics
  const calculateMetrics = () => {
    const now = new Date();
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "Completed").length;
    const ongoing = tasks.filter(t => t.status === "Ongoing").length;
    const pending = tasks.filter(t => t.status === "Pending").length;
    const overdue = tasks.filter(t => {
      const taskDate = new Date(t.deadline);
      return taskDate < now && t.status !== "Completed";
    }).length;

    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
    const onTimeRate = total > 0 ? (((completed + ongoing) / total) * 100).toFixed(1) : 0;

    return {
      total,
      completed,
      ongoing,
      pending,
      overdue,
      completionRate,
      onTimeRate
    };
  };

  // Generate time series data based on selected date range
  const generateTimeSeriesData = () => {
    const data = [];
    const now = new Date();
    let days = 30;

    // Determine number of days based on date range
    switch (dateRange) {
      case 'last7days':
        days = 7;
        break;
      case 'last30days':
        days = 30;
        break;
      case 'last90days':
        days = 90;
        break;
      case 'last6months':
        days = 180;
        break;
      default:
        days = 30;
    }

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt || task.deadline);
        return taskDate.toDateString() === date.toDateString();
      });

      const completedTasks = dayTasks.filter(t => t.status === "Completed").length;
      const ongoingTasks = dayTasks.filter(t => t.status === "Ongoing").length;
      const pendingTasks = dayTasks.filter(t => t.status === "Pending").length;

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completed: completedTasks,
        ongoing: ongoingTasks,
        pending: pendingTasks,
        total: dayTasks.length
      });
    }

    return data;
  };

  // Generate weekly performance data based on date range
  const generateWeeklyData = () => {
    const weeks = [];
    const now = new Date();
    let numberOfWeeks = 12;

    // Adjust number of weeks based on date range
    switch (dateRange) {
      case 'last7days':
        numberOfWeeks = 1;
        break;
      case 'last30days':
        numberOfWeeks = 4;
        break;
      case 'last90days':
        numberOfWeeks = 12;
        break;
      case 'last6months':
        numberOfWeeks = 24;
        break;
      default:
        numberOfWeeks = 12;
    }

    for (let i = numberOfWeeks - 1; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekTasks = tasks.filter(task => {
        const taskDate = new Date(task.deadline);
        return taskDate >= weekStart && taskDate <= weekEnd;
      });

      const completed = weekTasks.filter(t => t.status === "Completed").length;
      const total = weekTasks.length;
      const efficiency = total > 0 ? (completed / total) * 100 : 0;

      weeks.push({
        week: `Week ${numberOfWeeks - i}`,
        completed,
        total,
        efficiency: efficiency.toFixed(1),
        productivity: Math.min(100, efficiency + Math.random() * 20)
      });
    }

    return weeks;
  };

  // Generate priority distribution data
  const generatePriorityData = () => {
    const priorities = ['High', 'Medium', 'Low'];
    return priorities.map(priority => ({
      name: priority,
      value: tasks.filter(t => t.priority === priority).length,
      color: priority === 'High' ? '#ef4444' :
        priority === 'Medium' ? '#f59e0b' : '#10b981'
    }));
  };

  // Generate status distribution data
  const generateStatusData = () => {
    const statuses = [
      { name: 'Completed', value: tasks.filter(t => t.status === 'Completed').length, color: '#10b981' },
      { name: 'Ongoing', value: tasks.filter(t => t.status === 'Ongoing').length, color: '#3b82f6' },
      { name: 'Pending', value: tasks.filter(t => t.status === 'Pending').length, color: '#f59e0b' },
      {
        name: 'Overdue', value: tasks.filter(t => {
          const taskDate = new Date(t.deadline);
          return taskDate < new Date() && t.status !== 'Completed';
        }).length, color: '#ef4444'
      }
    ];
    return statuses.filter(s => s.value > 0);
  };

  // Generate monthly comparison data based on date range
  const generateMonthlyData = () => {
    const months = [];
    const now = new Date();
    let numberOfMonths = 6;

    // Adjust number of months based on date range
    switch (dateRange) {
      case 'last7days':
      case 'last30days':
        numberOfMonths = 3;
        break;
      case 'last90days':
        numberOfMonths = 6;
        break;
      case 'last6months':
        numberOfMonths = 6;
        break;
      default:
        numberOfMonths = 6;
    }

    for (let i = numberOfMonths - 1; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthTasks = tasks.filter(task => {
        const taskDate = new Date(task.deadline);
        return taskDate >= month && taskDate <= monthEnd;
      });

      const completed = monthTasks.filter(t => t.status === "Completed").length;
      const total = monthTasks.length;

      months.push({
        month: month.toLocaleDateString('en-US', { month: 'short' }),
        completed,
        total,
        target: Math.max(total, completed + 2), // Simulated target
        efficiency: total > 0 ? ((completed / total) * 100).toFixed(1) : 0
      });
    }

    return months;
  };



  // Regenerate data when tasks or dateRange changes
  const metrics = React.useMemo(() => calculateMetrics(), [tasks]);
  const timeSeriesData = React.useMemo(() => generateTimeSeriesData(), [tasks, dateRange]);
  const weeklyData = React.useMemo(() => generateWeeklyData(), [tasks, dateRange]);
  const priorityData = React.useMemo(() => generatePriorityData(), [tasks]);
  const statusData = React.useMemo(() => generateStatusData(), [tasks]);
  const monthlyData = React.useMemo(() => generateMonthlyData(), [tasks, dateRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">Track your performance and progress</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-0 sm:min-w-[160px]"
            >
              <option value="last7days">Last 7 days</option>
              <option value="last30days">Last 30 days</option>
              <option value="last90days">Last 90 days</option>
              <option value="last6months">Last 6 months</option>
            </select>

            <div className="flex items-center gap-2 sm:gap-3">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                <FaFilter className="w-4 h-4" />
                <span className="sm:hidden">Filter</span>
                <span className="hidden sm:inline">Filter</span>
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                <FaShare className="w-4 h-4" />
                <span className="sm:hidden">Share</span>
                <span className="hidden sm:inline">Share</span>
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                <FaDownload className="w-4 h-4" />
                <span className="sm:hidden">Export</span>
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaTasks className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{metrics.total}</div>
                <div className="text-sm text-gray-500">Total Tasks</div>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <FaArrowUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+12.5%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{metrics.completionRate}%</div>
                <div className="text-sm text-gray-500">Completion Rate</div>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <FaArrowUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+8.2%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaClock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{metrics.pending}</div>
                <div className="text-sm text-gray-500">Pending Tasks</div>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <FaArrowDown className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-red-600 font-medium">-5.1%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <FaExclamationTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{metrics.overdue}</div>
                <div className="text-sm text-gray-500">Overdue Tasks</div>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <FaArrowDown className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">-15.3%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Task Progress Over Time */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Task Progress Over Time</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {dateRange === 'last7days' ? 'Last 7 days' :
                    dateRange === 'last30days' ? 'Last 30 days' :
                      dateRange === 'last90days' ? 'Last 90 days' :
                        dateRange === 'last6months' ? 'Last 6 months' : 'Last 30 days'}
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
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
                <Area
                  type="monotone"
                  dataKey="completed"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Completed"
                />
                <Area
                  type="monotone"
                  dataKey="ongoing"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="Ongoing"
                />
                <Area
                  type="monotone"
                  dataKey="pending"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.6}
                  name="Pending"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Task Status Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Task Status Distribution</h3>
              <div className="text-sm text-gray-500">Current Status</div>
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

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Weekly Performance */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Weekly Performance</h3>
              <div className="text-sm text-gray-500">
                {dateRange === 'last7days' ? 'Last week' :
                  dateRange === 'last30days' ? 'Last 4 weeks' :
                    dateRange === 'last90days' ? 'Last 12 weeks' :
                      dateRange === 'last6months' ? 'Last 24 weeks' : 'Last 12 weeks'}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" name="Completed Tasks" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total" fill="#e5e7eb" name="Total Tasks" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Priority Distribution</h3>
            </div>
            <div className="space-y-4">
              {priorityData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900 font-semibold">{item.value}</span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          backgroundColor: item.color,
                          width: `${(item.value / Math.max(...priorityData.map(d => d.value))) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Monthly Comparison */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Performance Comparison</h3>
            <div className="text-sm text-gray-500">
              {dateRange === 'last7days' || dateRange === 'last30days' ? 'Last 3 months' :
                dateRange === 'last90days' || dateRange === 'last6months' ? 'Last 6 months' : 'Last 6 months'}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
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
                dataKey="completed"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                name="Completed Tasks"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                name="Target"
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#6b7280"
                strokeWidth={2}
                dot={{ fill: '#6b7280', strokeWidth: 2, r: 4 }}
                name="Total Tasks"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>



        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <FaChartLine className="w-8 h-8 opacity-80" />
              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                This Month
              </span>
            </div>
            <div className="text-3xl font-bold mb-2">{metrics.completed}</div>
            <div className="text-blue-100">Tasks Completed</div>
            <div className="mt-4 text-sm">
              <span className="text-blue-200">Efficiency: </span>
              <span className="font-semibold">{metrics.completionRate}%</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <FaChartPie className="w-8 h-8 opacity-80" />
              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                Average
              </span>
            </div>
            <div className="text-3xl font-bold mb-2">{metrics.onTimeRate}%</div>
            <div className="text-green-100">On-Time Delivery</div>
            <div className="mt-4 text-sm">
              <span className="text-green-200">Target: </span>
              <span className="font-semibold">85%</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <FaChartBar className="w-8 h-8 opacity-80" />
              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                Trend
              </span>
            </div>
            <div className="text-3xl font-bold mb-2">
              {weeklyData.length > 0 ? weeklyData[weeklyData.length - 1].efficiency : 0}%
            </div>
            <div className="text-purple-100">Weekly Efficiency</div>
            <div className="mt-4 text-sm">
              <span className="text-purple-200">vs Last Week: </span>
              <span className="font-semibold">+5.2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;