import React, { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { FaTasks, FaCheckCircle, FaSpinner, FaClock, FaPlus, FaFilter } from "react-icons/fa";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

export default function InternDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All Tasks");

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b"];

  useEffect(() => {
    if (user?.id || user?._id) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/api/task/assigned?internId=${user.id || user._id}`)
        .then((res) => {
          console.log('API Response:', res.data);
          
          const internTasks = res.data.filter(task => {
            const userId = user.id || user._id;
            const taskAssignedTo = task.assignedTo?._id || task.assignedTo?.id;
            const isAssigned = taskAssignedTo === userId || task.internId === userId;
            
            console.log('Task:', task.title, 'Assigned to:', taskAssignedTo, 'User:', userId, 'Match:', isAssigned);
            return isAssigned;
          });
          
          console.log('Filtered tasks:', internTasks);
          setTasks(internTasks);
        })
        .catch((error) => {
          console.error('Error fetching tasks:', error);
          setTasks([]);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  // Filter tasks based on active filter
  const getFilteredTasks = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    switch (activeFilter) {
      case "Today":
        return tasks.filter(task => {
          const taskDate = new Date(task.deadline);
          return taskDate >= today && taskDate < tomorrow;
        });
      
      case "This Week":
        return tasks.filter(task => {
          const taskDate = new Date(task.deadline);
          return taskDate >= startOfWeek && taskDate <= endOfWeek;
        });
      
      case "Backlog":
        return tasks.filter(task => {
          const taskDate = new Date(task.deadline);
          return taskDate < today && task.status !== "Completed";
        });
      
      case "All Tasks":
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  const now = new Date();
  const displayStatus = (task) => {
    if (task.status === "Ongoing" && task.deadline && new Date(task.deadline) < now) {
      return "Pending";
    }
    return task.status;
  };

  // Calculate stats based on filtered tasks
  const total = filteredTasks.length;
  const completed = filteredTasks.filter((t) => displayStatus(t) === "Completed").length;
  const ongoing = filteredTasks.filter((t) => displayStatus(t) === "Ongoing").length;
  const pending = filteredTasks.filter((t) => displayStatus(t) === "Pending").length;

  const statusData = [
    { name: "In Progress", value: ongoing, color: "#3b82f6" },
    { name: "Completed", value: completed, color: "#22c55e" },
    { name: "Pending", value: pending, color: "#f59e0b" },
  ];

  // Real data for line chart based on task completion dates
  const getLineChartData = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    // Initialize data for last 12 months
    const chartData = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      chartData.push({
        month: monthNames[date.getMonth()],
        year: date.getFullYear(),
        completed: 0,
        created: 0,
        total: 0
      });
    }
    
    // Count tasks by month
    tasks.forEach(task => {
      // Count completed tasks by completion date (you might need to add completedAt field to your backend)
      // For now, we'll use deadline date as approximation for completed tasks
      if (task.status === 'Completed' && task.deadline) {
        const taskDate = new Date(task.deadline);
        const monthIndex = chartData.findIndex(item => 
          item.month === monthNames[taskDate.getMonth()] && 
          item.year === taskDate.getFullYear()
        );
        if (monthIndex !== -1) {
          chartData[monthIndex].completed++;
        }
      }
      
      // Count all tasks by deadline month
      if (task.deadline) {
        const taskDate = new Date(task.deadline);
        const monthIndex = chartData.findIndex(item => 
          item.month === monthNames[taskDate.getMonth()] && 
          item.year === taskDate.getFullYear()
        );
        if (monthIndex !== -1) {
          chartData[monthIndex].total++;
        }
      }
      
      // If you have createdAt field, count tasks by creation date
      if (task.createdAt) {
        const createdDate = new Date(task.createdAt);
        const monthIndex = chartData.findIndex(item => 
          item.month === monthNames[createdDate.getMonth()] && 
          item.year === createdDate.getFullYear()
        );
        if (monthIndex !== -1) {
          chartData[monthIndex].created++;
        }
      }
    });
    
    return chartData;
  };

  const lineChartData = getLineChartData();

  // Group filtered tasks
  const groupedTasks = {
    "Upcoming Tasks": filteredTasks.filter((t) => displayStatus(t) === "Pending"),
    "In Progress": filteredTasks.filter((t) => displayStatus(t) === "Ongoing"),
    "Completed": filteredTasks.filter((t) => displayStatus(t) === "Completed"),
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRandomColor = (name) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-yellow-500'];
    if (!name) return colors[0];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  const generateTaskId = (index) => {
    return `TASK-${String(index + 1).padStart(2, '0')}`;
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    setUpdating(taskId);
    try {
      console.log('Updating task status:', taskId, 'to:', newStatus);
      
      const response = await axios.patch(`http://localhost:5000/api/task/update-status/${taskId}`, { 
        status: newStatus 
      });
      
      console.log('Status update response:', response.data);
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
      
      alert('Task status updated successfully!');
    } catch (error) {
      console.error('Error updating task status:', error);
      
      try {
        const response = await axios.put(`http://localhost:5000/api/task/${taskId}`, { 
          status: newStatus 
        });
        
        console.log('PUT Status update response:', response.data);
        
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
        
        alert('Task status updated successfully!');
      } catch (putError) {
        console.error('Both PATCH and PUT failed:', putError);
        alert('Failed to update task status. Please check console for errors.');
      }
    } finally {
      setUpdating(null);
    }
  };

  const downloadFile = async (task) => {
    if (!task.file) {
      alert('No file attached to this task');
      return;
    }
    
    console.log('Task file info:', task.file);
    
    try {
      console.log('Trying API endpoint download...');
      const response = await axios.get(
        `http://localhost:5000/api/task/${task._id}/file`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers['content-disposition'];
      let filename = `${task.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('File downloaded successfully via API');
    } catch (error) {
      console.error('API download failed:', error);
      
      try {
        console.log('Trying direct file download...');
        const directUrl = `http://localhost:5000/${task.file}`;
        
        const link = document.createElement('a');
        link.href = directUrl;
        link.setAttribute('download', task.file.split('/').pop() || 'file');
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('File downloaded successfully via direct URL');
      } catch (directError) {
        console.error('Direct download also failed:', directError);
        alert('Unable to download file. The file may not exist or the server is not accessible.');
      }
    }
  };

  const handleTaskClick = (task) => {
    const hasFile = task.file && task.file.trim() !== '';
    
    console.log('Task clicked:', task);
    console.log('Has file:', hasFile, 'File path:', task.file);
    
    const modalHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;" onclick="this.remove()">
        <div style="background: white; padding: 20px; border-radius: 12px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;" onclick="event.stopPropagation()">
          <div style="font-family: Arial, sans-serif;">
            <h3 style="margin-bottom: 15px; color: #333; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
              📋 ${task.title}
            </h3>
            
            <div style="margin-bottom: 15px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                  <strong style="color: #374151;">Status:</strong><br>
                  <span style="display: inline-block; margin-top: 5px; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; ${
                    task.status === "Completed" ? "background: #dcfce7; color: #166534;" :
                    task.status === "Ongoing" ? "background: #dbeafe; color: #1e40af;" :
                    "background: #fef3c7; color: #92400e;"
                  }">${task.status}</span>
                </div>
                <div>
                  <strong style="color: #374151;">Due Date:</strong><br>
                  <span style="margin-top: 5px; display: block; color: ${
                    new Date(task.deadline) < new Date() ? '#dc2626' : '#374151'
                  };">${task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Not set'}</span>
                </div>
              </div>
              
              ${task.description ? `
                <div style="margin-bottom: 15px;">
                  <strong style="color: #374151;">Description:</strong><br>
                  <p style="margin-top: 5px; color: #6b7280; line-height: 1.5;">${task.description}</p>
                </div>
              ` : ''}
            </div>
            
            ${hasFile ? `
              <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 24px;">📎</span>
                    <div>
                      <div style="font-weight: 600; color: #374151;">File Attached</div>
                      <div style="font-size: 12px; color: #6b7280;">Path: ${task.file}</div>
                    </div>
                  </div>
                  <button 
                    onclick="window.taskDownloadFunction()"
                    style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s;"
                    onmouseover="this.style.background='#2563eb'; this.style.transform='translateY(-1px)'" 
                    onmouseout="this.style.background='#3b82f6'; this.style.transform='translateY(0)'"
                  >
                    📥 Download File
                  </button>
                </div>
              </div>
            ` : `
              <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 15px; text-align: center;">
                <div style="color: #6b7280;">📄 No files attached to this task</div>
              </div>
            `}
            
            <div style="text-align: right; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
              <button 
                onclick="this.closest('[style*=\"position: fixed\"]').remove(); delete window.taskDownloadFunction;" 
                style="padding: 8px 16px; background: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;"
                onmouseover="this.style.background='#4b5563'" 
                onmouseout="this.style.background='#6b7280'"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    const modal = document.createElement('div');
    modal.innerHTML = modalHTML;
    
    if (hasFile) {
      window.taskDownloadFunction = () => downloadFile(task);
    }
    
    document.body.appendChild(modal);
  };

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
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your projects today</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {getInitials(user?.name)}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { title: "Total Tasks", value: total, icon: <FaTasks />, color: "from-purple-500 to-purple-600", bgColor: "bg-purple-100" },
            { title: "Completed", value: completed, icon: <FaCheckCircle />, color: "from-green-500 to-green-600", bgColor: "bg-green-100" },
            { title: "In Progress", value: ongoing, icon: <FaSpinner />, color: "from-blue-500 to-blue-600", bgColor: "bg-blue-100" },
            { title: "Upcoming", value: pending, icon: <FaClock />, color: "from-orange-500 to-orange-600", bgColor: "bg-orange-100" },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                  <div className="text-gray-600 text-lg">
                    {card.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Task Distribution - Donut Chart */}
          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Task Statistics</h2>
            <div className="flex items-center justify-between">
              {/* Donut Chart */}
              <div className="relative flex-shrink-0">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      strokeWidth={0}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-gray-900">{total}</div>
                  <div className="text-sm text-gray-500">Tasks</div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex-1 ml-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-600">In Progress</span>
                  </div>
                  <div className="font-semibold text-gray-900">{ongoing}</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600">Total Completed</span>
                  </div>
                  <div className="font-semibold text-gray-900">{completed}</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm text-gray-600">Total Pending</span>
                  </div>
                  <div className="font-semibold text-gray-900">{pending}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Task Analytics - Line Chart */}
          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Task Analytics</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                  formatter={(value, name) => [
                    value,
                    name === 'completed' ? 'Completed Tasks' :
                    name === 'total' ? 'Total Tasks' : 'Created Tasks'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#22c55e' }}
                  name="completed"
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, fill: '#3b82f6' }}
                  name="total"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Completed Tasks</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Total Tasks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Tasks Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <FaFilter className="text-sm" />
                  <span className="text-sm font-medium">Quick Filters</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors">
                  <FaPlus className="text-sm" />
                  <span className="text-sm font-medium">Add New</span>
                </button>
              </div>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex space-x-6">
              {["All Tasks", "This Week", "Today", "Backlog"].map((filter) => {
                let filterCount = 0;
                if (filter === "All Tasks") {
                  filterCount = tasks.length;
                } else {
                  const tempFilter = filter;
                  const now = new Date();
                  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
                  
                  const startOfWeek = new Date(today);
                  const day = startOfWeek.getDay();
                  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
                  startOfWeek.setDate(diff);
                  
                  const endOfWeek = new Date(startOfWeek);
                  endOfWeek.setDate(startOfWeek.getDate() + 6);
                  endOfWeek.setHours(23, 59, 59, 999);

                  switch (tempFilter) {
                    case "Today":
                      filterCount = tasks.filter(task => {
                        const taskDate = new Date(task.deadline);
                        return taskDate >= today && taskDate < tomorrow;
                      }).length;
                      break;
                    case "This Week":
                      filterCount = tasks.filter(task => {
                        const taskDate = new Date(task.deadline);
                        return taskDate >= startOfWeek && taskDate <= endOfWeek;
                      }).length;
                      break;
                    case "Backlog":
                      filterCount = tasks.filter(task => {
                        const taskDate = new Date(task.deadline);
                        return taskDate < today && task.status !== "Completed";
                      }).length;
                      break;
                  }
                }

                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeFilter === filter
                        ? "border-black text-black"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {filter}
                    <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded-full">{filterCount}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kanban Board */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Object.entries(groupedTasks).map(([status, statusTasks]) => (
                <div key={status} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">{status}</h3>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                      {statusTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {statusTasks.length === 0 ? (
                      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                        <p className="text-gray-400 text-sm">No tasks in {status.toLowerCase()}</p>
                      </div>
                    ) : (
                      statusTasks.map((task, index) => (
                        <div
                          key={task._id}
                          onClick={() => handleTaskClick(task)}
                          className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-all cursor-pointer group"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="text-xs text-gray-500 font-medium">
                              {task.taskId || generateTaskId(index)}
                            </div>
                            <div className="text-right">
                              <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                                new Date(task.deadline) < new Date() 
                                  ? "bg-red-100 text-red-700"
                                  : new Date(task.deadline) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                              }`}>
                                Due: {formatDate(task.deadline)}
                              </div>
                            </div>
                          </div>
                          
                          <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {task.title}
                          </h4>
                          
                          {task.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                          )}

                          <div className="mb-3 flex items-center justify-between">
                            <select
                              value={task.status}
                              onChange={(e) => {
                                e.stopPropagation();
                                updateTaskStatus(task._id, e.target.value);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              disabled={updating === task._id}
                              className={`text-xs px-2 py-1 rounded-full font-medium border-none outline-none cursor-pointer disabled:opacity-50 ${
                                task.status === "Completed"
                                  ? "bg-green-100 text-green-700"
                                  : task.status === "Ongoing"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Ongoing">Ongoing</option>
                              <option value="Completed">Completed</option>
                            </select>
                            
                            {updating === task._id && (
                              <div className="flex items-center space-x-1 text-blue-500">
                                <FaSpinner className="animate-spin text-xs" />
                                <span className="text-xs">Updating...</span>
                              </div>
                            )}
                            
                            {task.file && task.file.trim() !== '' && (
                              <div className="flex items-center space-x-1 text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                </svg>
                                <span className="text-xs font-medium">1 file</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}