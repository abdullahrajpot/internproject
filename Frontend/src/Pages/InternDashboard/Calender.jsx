import React, { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { FaChevronLeft, FaChevronRight, FaClock, FaCalendarAlt, FaBell } from "react-icons/fa";
import axios from "axios";

export default function Calender() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'
  const [currentTime, setCurrentTime] = useState(new Date());

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
          console.log('Fetched tasks:', internTasks);
          
          // Add a test task if no tasks exist (for debugging)
          if (internTasks.length === 0) {
            const testTask = {
              _id: 'test-task',
              title: 'Test Task',
              description: 'This is a test task for debugging',
              deadline: new Date().toISOString(), // Today at current time
              status: 'Pending'
            };
            console.log('Adding test task:', testTask);
            setTasks([testTask]);
          } else {
            setTasks(internTasks);
          }
        })
        .catch((error) => {
          console.error('Error fetching tasks:', error);
          setTasks([]);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  // Get tasks for selected date
  useEffect(() => {
    const tasksForDate = getTasksForDate(selectedDate);
    console.log('Selected date:', selectedDate.toDateString());
    console.log('Tasks for selected date:', tasksForDate);
    setSelectedDateTasks(tasksForDate);
  }, [selectedDate, tasks]);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const monthNames = ["January", "February", "March", "April", "May", "June", 
                     "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.deadline);
      return taskDate.getDate() === date.getDate() &&
             taskDate.getMonth() === date.getMonth() &&
             taskDate.getFullYear() === date.getFullYear();
    });
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

  const formatTimeRange = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const startTime = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    
    // Add 2 hours for end time (you can adjust this logic)
    const endDate = new Date(date.getTime() + 2 * 60 * 60 * 1000);
    const endTime = endDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    
    return `${startTime} - ${endTime}`;
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }
    return weekDays;
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const getTaskColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 border-l-green-500 text-green-800 shadow-md';
      case 'Ongoing': return 'bg-blue-100 border-l-blue-500 text-blue-800 shadow-md';
      case 'Pending': return 'bg-orange-100 border-l-orange-500 text-orange-800 shadow-md';
      default: return 'bg-purple-100 border-l-purple-500 text-purple-800 shadow-md';
    }
  };

  const getTaskAccentColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-400';
      case 'Ongoing': return 'bg-blue-400';
      case 'Pending': return 'bg-orange-400';
      default: return 'bg-gray-400';
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Get current time for real-time display
  const getCurrentTimeSlot = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    return { hour: currentHour, minute: currentMinute };
  };

  const isCurrentTimeSlot = (timeSlot) => {
    const currentTime = getCurrentTimeSlot();
    const slotHour = parseInt(timeSlot.split(':')[0]);
    return currentTime.hour === slotHour;
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
            <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
          </div>
          <div className="flex items-center space-x-4">
            <FaBell className="text-gray-600 hover:text-gray-800 cursor-pointer" />
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="font-semibold text-gray-900">{user?.name}</div>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {getInitials(user?.name)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Calendar Section */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm">
            {/* Calendar Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <button 
                    onClick={() => viewMode === 'week' ? navigateWeek(-1) : navigateMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FaChevronLeft className="text-gray-500" />
                  </button>
                  <button 
                    onClick={() => viewMode === 'week' ? navigateWeek(1) : navigateMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FaChevronRight className="text-gray-500" />
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <select 
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="week">Weekly</option>
                    <option value="month">Monthly</option>
                  </select>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded"></div>
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                    <FaCalendarAlt className="text-white text-sm" />
                  </div>
                </div>
              </div>

              {/* Month Navigation */}
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {monthNames.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => {
                      const newDate = new Date(currentDate);
                      newDate.setMonth(index);
                      setCurrentDate(newDate);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                      index === currentDate.getMonth()
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>

            {/* Week View */}
            {viewMode === 'week' && (
              <div className="p-6">
                {/* Week Days Header */}
                <div className="flex justify-center mb-6">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => navigateWeek(-1)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <FaChevronLeft className="text-gray-500" />
                    </button>
                    
                    <div className="flex space-x-1">
                      {getWeekDays().map((day, index) => {
                        const isToday = day.toDateString() === new Date().toDateString();
                        const isSelected = day.toDateString() === selectedDate.toDateString();
                        return (
                          <div key={index} className="text-center">
                            <div className="text-xs text-gray-500 mb-2 font-medium">
                              {shortDayNames[day.getDay()]}
                            </div>
                            <div 
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-blue-500 text-white shadow-lg'
                                  : isToday
                                  ? 'bg-red-500 text-white shadow-md'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                              onClick={() => setSelectedDate(day)}
                            >
                              {day.getDate()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <button 
                      onClick={() => navigateWeek(1)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <FaChevronRight className="text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Time Slots for Selected Date Only */}
                <div className="max-w-2xl mx-auto">
                  <div className="space-y-2">
                    {timeSlots.map((time, timeIndex) => {
                      const isCurrentTime = isCurrentTimeSlot(time);
                      const timeHour = parseInt(time.split(':')[0]);
                      const tasksAtTime = selectedDateTasks.filter(task => {
                        const taskDate = new Date(task.deadline);
                        const taskHour = taskDate.getHours();
                        console.log(`Time slot ${time} (${timeHour}) - Task: ${task.title} at hour ${taskHour} - Match: ${taskHour === timeHour}`);
                        return taskHour === timeHour;
                      });

                      const isToday = selectedDate.toDateString() === new Date().toDateString();

                      return (
                        <div key={timeIndex} className="flex items-start">
                          {/* Time Label */}
                          <div className={`w-20 text-right pr-4 py-4 text-sm font-medium ${
                            isCurrentTime && isToday ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {time}
                          </div>
                          
                          {/* Task Area */}
                          <div className={`flex-1 min-h-[50px] border-t border-gray-200 py-2 relative ${
                            isCurrentTime && isToday ? 'bg-blue-50 border-l-4 border-l-blue-400' : ''
                          }`}>
                            {tasksAtTime.length > 0 ? (
                              <div className="space-y-2">
                                {tasksAtTime.map((task, taskIndex) => (
                                  <div
                                    key={taskIndex}
                                    className={`p-1 px-3 rounded-md border-l-4 ${getTaskColor(task.status)} cursor-pointer hover:shadow-lg transition-all duration-200`}
                                  >
                                    <div className="font-semibold text-base mb-2">
                                      {task.title}
                                    </div>
                                    <div className="text-sm text-gray-600 flex items-center mb-2">
                                      <FaClock className="mr-2" size={12} />
                                      {formatTime(task.deadline)}
                                    </div>
                                    {/* {task.description && (
                                      <div className="text-sm text-gray-500">
                                        {task.description}
                                      </div>
                                    )} */}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              // Show debug info for empty slots
                              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                                {selectedDateTasks.length > 0 ? `No tasks at ${time}` : 'No tasks for this date'}
                              </div>
                            )}
                            
                            {/* Current time indicator */}
                            {isCurrentTime && isToday && (
                              <div 
                                className="absolute left-0 right-0 h-0.5 bg-red-500 z-30"
                                style={{ 
                                  top: `${(getCurrentTimeSlot().minute / 60) * 80 + 16}px`
                                }}
                              >
                                <div className="absolute -left-1 -top-1 w-2 h-2 bg-red-500 rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Month View */}
            {viewMode === 'month' && (
              <div className="p-6">
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {dayNames.map(day => (
                    <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {getMonthDays().map((day, index) => {
                    const dayTasks = getTasksForDate(day);
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    const isToday = day.toDateString() === new Date().toDateString();
                    const isSelected = day.toDateString() === selectedDate.toDateString();

                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedDate(day)}
                        className={`p-3 min-h-[100px] border border-gray-100 cursor-pointer hover:bg-gray-50 ${
                          !isCurrentMonth ? 'text-gray-300 bg-gray-50' : ''
                        } ${isToday ? 'bg-blue-50 border-blue-200' : ''}
                        ${isSelected ? 'bg-blue-100 border-blue-300' : ''}`}
                      >
                        <div className={`text-sm font-medium mb-1 ${
                          isToday ? 'text-blue-600' : isSelected ? 'text-blue-600' : ''
                        }`}>
                          {day.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayTasks.slice(0, 2).map((task, taskIndex) => (
                            <div
                              key={taskIndex}
                              className={`text-xs p-1 rounded truncate ${getTaskColor(task.status)}`}
                            >
                              {task.title}
                            </div>
                          ))}
                          {dayTasks.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{dayTasks.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Selected Date Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  {selectedDate.getDate()}
                </div>
                <div className="text-lg text-gray-600 mb-2">
                  {monthNames[selectedDate.getMonth()]} {dayNames[selectedDate.getDay()]}
                </div>
                <div className="text-sm text-gray-500">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </div>
              </div>

              {/* Task Progress */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-1">
                    {selectedDateTasks.filter(t => t.status === 'Ongoing').length.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-500">Task in progress</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 mb-1">
                    {selectedDateTasks.filter(t => t.status === 'Completed').length.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-500">Task Complete</div>
                </div>
              </div>
            </div>

            {/* Reminders */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reminders</h3>
              <div className="space-y-3">
                {selectedDateTasks.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <FaCalendarAlt className="text-3xl mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No tasks for this date</p>
                  </div>
                ) : (
                  selectedDateTasks
                    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                    .map((task, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        task.status === 'Completed' ? 'bg-green-100' :
                        task.status === 'Ongoing' ? 'bg-blue-100' : 'bg-orange-100'
                      }`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                          task.status === 'Completed' ? 'bg-green-500 text-white' :
                          task.status === 'Ongoing' ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white'
                        }`}>
                          {task.title.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate mb-1">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTime(task.deadline)}
                        </p>
                        {task.description && (
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            {task.description.substring(0, 40)}...
                          </p>
                        )}
                      </div>
                      <button className="text-gray-300 hover:text-gray-500 transition-colors">
                        <div className="flex flex-col space-y-0.5">
                          <div className="w-1 h-1 bg-current rounded-full"></div>
                          <div className="w-1 h-1 bg-current rounded-full"></div>
                          <div className="w-1 h-1 bg-current rounded-full"></div>
                        </div>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}