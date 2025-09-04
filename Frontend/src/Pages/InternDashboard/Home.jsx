import React, { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { FaTasks, FaCheckCircle, FaSpinner, FaClock, FaBell, FaSearch, FaChevronLeft, FaChevronRight, FaVideo, FaUsers } from "react-icons/fa";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function InternDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);



  useEffect(() => {
    if (user?.id || user?._id) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/api/task/assigned?internId=${user.id || user._id}`)
        .then((res) => {
          const internTasks = res.data.filter(task => {
            const userId = user.id || user._id;
            const taskAssignedTo = task.assignedTo?._id || task.assignedTo?.id;
            const isAssigned = taskAssignedTo === userId || task.internId === userId;
            return isAssigned;
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

  // Calculate days difference
  const getDaysLeft = (deadline) => {
    if (!deadline) return 0;
    const today = new Date();
    const dueDate = new Date(deadline);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get today's tasks
  const getTodayTasks = () => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    return tasks.filter(task => {
      const taskDate = new Date(task.deadline);
      return taskDate >= todayStart && taskDate < todayEnd;
    });
  };

  const now = new Date();
  const displayStatus = (task) => {
    if (task.status === "Ongoing" && task.deadline && new Date(task.deadline) < now) {
      return "Pending";
    }
    return task.status;
  };

  // Calculate stats
  const total = tasks.length;
  const completed = tasks.filter((t) => displayStatus(t) === "Completed").length;
  const ongoing = tasks.filter((t) => displayStatus(t) === "Ongoing").length;
  const pending = tasks.filter((t) => displayStatus(t) === "Pending").length;

  const todayTasks = getTodayTasks();

  const statusData = [
    { name: "In Progress", value: ongoing, color: "#4F46E5" },
    { name: "Completed", value: completed, color: "#10B981" },
    { name: "Pending", value: pending, color: "#F59E0B" },
  ];

  // Calendar logic
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.deadline);
      return taskDate.getDate() === date &&
        taskDate.getMonth() === currentDate.getMonth() &&
        taskDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const tasksForDate = getTasksForDate(date);
    setSelectedDateTasks(tasksForDate);
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    setUpdating(taskId);
    try {
      await axios.patch(`http://localhost:5000/api/task/update-status/${taskId}`, {
        status: newStatus
      });

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getProgressPercentage = (task) => {
    if (task.status === 'Completed') return 100;
    if (task.status === 'Ongoing') return 65;
    return 25;
  };

  const getProgressColor = (task) => {
    if (task.status === 'Completed') return 'bg-green-500';
    if (task.status === 'Ongoing') return 'bg-blue-500';
    return 'bg-red-500';
  };

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <FaSpinner className="animate-spin text-blue-500" />
          <span className="text-gray-600">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-8">
        {/* Main Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hello {user?.name} !!!</h1>
            <p className="text-gray-500">Welcome Back !</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <FaBell className="text-gray-600 hover:text-gray-800 cursor-pointer" />
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="font-semibold text-gray-900">{user?.name}</div>
                <div className="text-sm text-gray-500">{user?.email}</div>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {getInitials(user?.name)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Statistics Cards */}
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Statistic</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <FaTasks className="text-2xl opacity-80" />
                    <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                      Total
                    </span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{total}</div>
                  <h3 className="font-semibold text-sm">All Tasks</h3>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <FaCheckCircle className="text-2xl text-green-500" />
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {completed} Tasks
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm">Completed</h3>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <FaSpinner className="text-2xl text-blue-500" />
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {ongoing} Tasks
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm">In Progress</h3>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <FaClock className="text-2xl text-orange-500" />
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {pending} Tasks
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm">Pending</h3>
                </div>
              </div>
            </div>

            {/* Project Progress */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Project</h2>
              <div className="space-y-6">
                {tasks.slice(0, 3).map((task) => {
                  const progressPercentage = getProgressPercentage(task);
                  const progressColor = getProgressColor(task);
                  const daysLeft = getDaysLeft(task.deadline);

                  return (
                    <div key={task._id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaTasks className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-600">{task.description?.substring(0, 50)}...</p>
                          <div className="flex items-center mt-2">
                            <div className="flex -space-x-2 mr-3">
                              <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white">
                                {getInitials(user?.name)}
                              </div>
                            </div>
                            <span className={`text-xs ${daysLeft < 0 ? 'text-red-500' : daysLeft <= 3 ? 'text-orange-500' : 'text-gray-500'}`}>
                              {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` :
                                daysLeft === 0 ? 'Due today' :
                                  `${daysLeft} days left`}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{progressPercentage}%</div>
                        <div className="w-20 h-2 bg-gray-200 rounded-full mt-2">
                          <div className={`h-full ${progressColor} rounded-full transition-all duration-300`} style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Task Today */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Task Today</h2>
              <div className="space-y-4">
                {todayTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FaTasks className="text-4xl mx-auto mb-4 opacity-50" />
                    <p>No tasks scheduled for today</p>
                  </div>
                ) : (
                  todayTasks.map((task) => (
                    <div key={task._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl hover:shadow-md transition-all duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex flex-col items-center justify-center text-white shadow-lg">
                          <div className="text-xs font-bold">Start From</div>
                          <div className="text-xs font-semibold">
                            {formatTime(task.deadline)}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {task.description?.substring(0, 60)}...
                          </p>
                          <div className="flex items-center mt-2 space-x-2">
                            <span className="text-xs text-gray-500">📍 {task.assignedBy?.name || 'Admin'}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">💬 0 comments</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button className="text-xs text-blue-600 bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-full font-medium transition-colors">
                          Reminder
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Combined Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            {/* Overall Progress */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-6 text-gray-800">Overall Progress</h2>
              <div className="relative flex items-center justify-center mb-6">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      strokeWidth={0}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-red-500">
                    {total > 0 ? Math.round((completed / total) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Task Finished</div>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FaChevronLeft className="text-gray-400 text-sm" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FaChevronRight className="text-gray-400 text-sm" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-3">
                {dayNames.map(day => (
                  <div key={day} className="p-2 text-center text-xs font-medium text-gray-400">
                    {day.substring(0, 3)}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 mb-4">
                {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, index) => (
                  <div key={`empty-${index}`} className="p-2"></div>
                ))}

                {Array.from({ length: getDaysInMonth(currentDate) }).map((_, index) => {
                  const day = index + 1;
                  const tasksForDay = getTasksForDate(day);
                  const isToday = new Date().getDate() === day &&
                    new Date().getMonth() === currentDate.getMonth() &&
                    new Date().getFullYear() === currentDate.getFullYear();
                  const isSelected = selectedDate === day;

                  return (
                    <div
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`relative p-3 text-center text-sm cursor-pointer hover:bg-gray-50 rounded-lg transition-colors ${isToday ? 'bg-red-500 text-white font-semibold' :
                          isSelected ? 'bg-blue-100 text-blue-600 font-semibold' :
                            'text-gray-700 hover:text-gray-900'
                        }`}
                    >
                      <div className="relative z-10">{day}</div>
                      {tasksForDay.length > 0 && (
                        <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : isSelected ? 'bg-blue-500' : 'bg-red-400'
                          }`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Tasks or Meetings */}
            <div>
              {selectedDate ? (
                selectedDateTasks.length > 0 ? (
                  <div>
                    <h3 className="font-semibold text-sm text-gray-800 mb-3">
                      Tasks for {monthNames[currentDate.getMonth()]} {selectedDate}
                    </h3>
                    <div className="space-y-3">
                      {selectedDateTasks.map((task) => (
                        <div key={task._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                              <FaUsers className="text-blue-500 text-lg" />
                            </div>
                            <div>
                              <p className="font-medium text-sm text-gray-900">{task.title}</p>
                              <p className="text-xs text-gray-500">Task Meeting</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-600 font-medium">{formatTime(task.deadline)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <FaTasks className="text-3xl mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500">No tasks found for {monthNames[currentDate.getMonth()]} {selectedDate}</p>
                  </div>
                )
              ) : (
                // Default meetings/events when no date is selected
                <div>
                  <div className="space-y-3">
                    {todayTasks.slice(0, 3).map((task) => (
                      <div key={task._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FaUsers className="text-blue-500 text-lg" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-900">{task.title}</p>
                            <p className="text-xs text-gray-500">Online Meeting</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-600 font-medium">{formatTime(task.deadline)}</span>
                        </div>
                      </div>
                    ))}
                    
                    {todayTasks.length === 0 && (
                      <div className="text-center py-6">
                        <FaUsers className="text-3xl mx-auto mb-3 text-gray-300" />
                        <p className="text-sm text-gray-500">No meetings scheduled</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}