import React, { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import axios from "axios";
import {
  FaTasks,
  FaCheckCircle,
  FaSpinner,
  FaClock,
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaSort,
  FaArrowLeft,
  FaDownload,
  FaEye,
  FaListUl,
  FaTh,
  FaChevronDown,
} from "react-icons/fa";
import { Router } from "react-router-dom";

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All Tasks");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("deadline");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("kanban"); // kanban or list
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");

  // Fetch tasks from API
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

    let filtered = tasks;

    // Time-based filtering
    switch (activeFilter) {
      case "Today":
        filtered = tasks.filter(task => {
          const taskDate = new Date(task.deadline);
          return taskDate >= today && taskDate < tomorrow;
        });
        break;
      case "This Week":
        filtered = tasks.filter(task => {
          const taskDate = new Date(task.deadline);
          return taskDate >= startOfWeek && taskDate <= endOfWeek;
        });
        break;
      case "Overdue":
        filtered = tasks.filter(task => {
          const taskDate = new Date(task.deadline);
          return taskDate < today && task.status !== "Completed";
        });
        break;
      default:
        filtered = tasks;
    }

    // Status filtering
    if (selectedStatus !== "All") {
      filtered = filtered.filter(task => task.status === selectedStatus);
    }

    // Priority filtering
    if (selectedPriority !== "All") {
      filtered = filtered.filter(task => task.priority === selectedPriority);
    }

    // Search filtering
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.assignedBy && task.assignedBy.name && task.assignedBy.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "deadline":
          aValue = new Date(a.deadline);
          bValue = new Date(b.deadline);
          break;
        case "priority":
          // Handle priority if it exists, otherwise default to medium
          const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
          aValue = priorityOrder[a.priority] || 2;
          bValue = priorityOrder[b.priority] || 2;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  const displayStatus = (task) => {
    const now = new Date();
    if (task.status === "Ongoing" && task.deadline && new Date(task.deadline) < now) {
      return "Overdue";
    }
    return task.status;
  };

  // Calculate stats
  const total = filteredTasks.length;
  const completed = filteredTasks.filter((t) => displayStatus(t) === "Completed").length;
  const ongoing = filteredTasks.filter((t) => displayStatus(t) === "Ongoing").length;
  const pending = filteredTasks.filter((t) => displayStatus(t) === "Pending").length;
  const overdue = filteredTasks.filter((t) => displayStatus(t) === "Overdue").length;
  

  // Group tasks for Kanban view
  const groupedTasks = {
    "Pending": filteredTasks.filter((t) => displayStatus(t) === "Pending"),
    "Ongoing": filteredTasks.filter((t) => displayStatus(t) === "Ongoing"),
    "Completed": filteredTasks.filter((t) => displayStatus(t) === "Completed"),
    "Overdue": filteredTasks.filter((t) => displayStatus(t) === "Overdue"),
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

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // In a real application, you might use a router here
      alert("No previous page to go back to.");
    }
  };

  const handleTaskClick = (task) => {
    const hasFile = task.file && task.file.trim() !== '';

    const modalHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;" onclick="this.remove()">
        <div style="background: white; padding: 30px; border-radius: 16px; max-width: 600px; width: 90%; max-height: 85vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);" onclick="event.stopPropagation()">
          <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
              <h3 style="margin: 0; color: #111827; font-size: 24px; font-weight: 700; line-height: 1.3;">
                ${task.title}
              </h3>
              <div style="display: flex; gap: 8px;">
                <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; ${
                  task.status === "Completed" ? "background: #dcfce7; color: #166534;" :
                  task.status === "Ongoing" ? "background: #dbeafe; color: #1e40af;" :
                  task.status === "Pending" ? "background: #fef3c7; color: #92400e;" :
                  "background: #fee2e2; color: #dc2626;"
                }">${task.status}</span>
              </div>
            </div>

            <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 16px;">
                <div>
                  <strong style="color: #374151; display: block; margin-bottom: 4px;">Due Date:</strong>
                  <span style="color: ${
                    new Date(task.deadline) < new Date() ? '#dc2626' : '#374151'
                  }; font-weight: 500;">${new Date(task.deadline).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                </div>
                <div>
                  <strong style="color: #374151; display: block; margin-bottom: 4px;">Assigned By:</strong>
                  <span style="color: #374151; font-weight: 500;">${task.assignedBy?.name || task.assignedBy || 'N/A'}</span>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                  <strong style="color: #374151; display: block; margin-bottom: 4px;">Created:</strong>
                  <span style="color: #374151; font-weight: 500;">${task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div>
                  <strong style="color: #374151; display: block; margin-bottom: 4px;">Task ID:</strong>
                  <span style="color: #374151; font-weight: 500; font-family: monospace;">${task._id.slice(-6).toUpperCase()}</span>
                </div>
              </div>
            </div>

            ${task.description ? `
              <div style="margin-bottom: 20px;">
                <strong style="color: #374151; display: block; margin-bottom: 8px;">Description:</strong>
                <p style="margin: 0; color: #6b7280; line-height: 1.6; background: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6;">${task.description}</p>
              </div>
            ` : ''}

            ${hasFile ? `
              <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 20px; border-radius: 12px; border: 1px solid #0ea5e9; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; background: #0ea5e9; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                      <span style="color: white; font-size: 18px;">📎</span>
                    </div>
                    <div>
                      <div style="font-weight: 600; color: #0c4a6e; margin-bottom: 2px;">Attachment Available</div>
                      <div style="font-size: 13px; color: #0369a1;">${task.file.split('/').pop()}</div>
                    </div>
                  </div>
                  <button
                    onclick="window.taskDownloadFunction()"
                    style="padding: 10px 20px; background: #0ea5e9; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"
                    onmouseover="this.style.background='#0284c7'; this.style.transform='translateY(-1px)'"
                    onmouseout="this.style.background='#0ea5e9'; this.style.transform='translateY(0)'"
                  >
                    <span style="margin-right: 8px;">📥</span>Download
                  </button>
                </div>
              </div>
            ` : `
              <div style="background: #f9fafb; padding: 20px; border-radius: 12px; border: 2px dashed #d1d5db; margin-bottom: 20px; text-align: center;">
                <div style="color: #6b7280; font-size: 14px;">📄 No files attached to this task</div>
              </div>
            `}

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <div style="font-size: 12px; color: #9ca3af;">
                Task ID: ${task._id.slice(-8).toUpperCase()}
              </div>
              <button
                onclick="this.closest('[style*=\"position: fixed\"]').remove(); delete window.taskDownloadFunction;"
                style="padding: 10px 24px; background: #6b7280; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s;"
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  const getPriorityColor = (priority) => {
    if (!priority) return "text-gray-700 bg-gray-100";
    switch (priority) {
      case "High": return "text-red-700 bg-red-100 border-red-200";
      case "Medium": return "text-yellow-700 bg-yellow-100 border-yellow-200";
      case "Low": return "text-green-700 bg-green-100 border-green-200";
      default: return "text-gray-700 bg-gray-100 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "text-green-700  border-green-200";
      case "Ongoing": return "text-blue-700 border-blue-200";
      case "Pending": return "text-yellow-700  border-yellow-200";
      case "Overdue": return "text-red-700  border-red-200";
      default: return "text-gray-700  border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <FaSpinner className="animate-spin text-blue-500 text-2xl" />
          <span className="text-gray-600 text-lg">Loading your tasks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button onClick={handleBack} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200">
                <FaArrowLeft className="text-xl" />
              </button>
              <div className="h-8 w-px bg-gray-300 hidden lg:block"></div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
                <p className="text-gray-600 mt-1">Manage and track your assigned tasks</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 shadow-sm border border-gray-300 ${
                  showFilters ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-700'
                }`}
              >
                <FaFilter className="text-sm" />
                <span className="text-sm font-medium">Filters</span>
                <FaChevronDown className={`text-xs transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <div className="flex items-center bg-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === 'kanban' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FaTh className="mr-1" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === 'list' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FaListUl className="mr-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6">
            {["All Tasks", "This Week", "Today", "Overdue"].map((filter) => {
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
                  case "Overdue":
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
                  className={`pb-3 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
                    activeFilter === filter
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {filter}
                  <span className="ml-2 text-xs font-semibold bg-gray-200 px-2 py-1 rounded-full transition-colors duration-200">
                    {filterCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="px-8 py-4 bg-gray-100 border-b transition-all duration-300 ease-in-out">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                >
                  <option value="deadline">Due Date</option>
                  <option value="title">Title</option>
                  <option value="status">Status</option>
                  <option value="createdAt">Created Date</option>
                </select>
              </div>

              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>

              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                >
                  <option value="All">All Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task Statistics */}
      <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex items-center justify-between transition-all duration-200 hover:shadow-xl hover:scale-105">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Tasks</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">{total}</h2>
          </div>
          <FaTasks className="text-blue-500 text-4xl opacity-50" />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex items-center justify-between transition-all duration-200 hover:shadow-xl hover:scale-105">
          <div>
            <p className="text-gray-500 text-sm font-medium">Completed</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">{completed}</h2>
          </div>
          <FaCheckCircle className="text-green-500 text-4xl opacity-50" />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex items-center justify-between transition-all duration-200 hover:shadow-xl hover:scale-105">
          <div>
            <p className="text-gray-500 text-sm font-medium">Ongoing</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">{ongoing}</h2>
          </div>
          <FaSpinner className="text-yellow-500 text-4xl opacity-50 animate-spin-slow" />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex items-center justify-between transition-all duration-200 hover:shadow-xl hover:scale-105">
          <div>
            <p className="text-gray-500 text-sm font-medium">Overdue</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">{overdue}</h2>
          </div>
          <FaClock className="text-red-500 text-4xl opacity-50" />
        </div>
      </div>

      {/* Task Content Area */}
      <div className="px-8 py-6">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-200">
            <FaTasks className="text-8xl text-gray-300 mx-auto" />
            <h3 className="mt-4 text-2xl font-semibold text-gray-900">No Tasks Found</h3>
            <p className="mt-2 text-gray-500">
              There are no tasks that match your current filters.
            </p>
          </div>
        ) : (
          viewMode === "list" ? (
            <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                    <th className="relative px-6 py-3 text-right"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTasks.map((task) => (
                    <tr key={task._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleTaskClick(task)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(displayStatus(task))}`}>
                          {displayStatus(task)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <FaCalendarAlt className="text-gray-400" />
                          <span>{formatDate(task.deadline)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getPriorityColor(task.priority)}`}>
                          {task.priority || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleTaskClick(task); }}
                            className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                            title="View Details"
                          >
                            <FaEye className="text-base" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateTaskStatus(task._id, 'Completed'); }}
                            disabled={task.status === 'Completed' || updating === task._id}
                            className={`p-2 rounded-full text-white transition-all duration-200 ${task.status === 'Completed' ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                            title="Mark as Completed"
                          >
                            {updating === task._id ? <FaSpinner className="animate-spin" /> : <FaCheckCircle className="text-sm" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.keys(groupedTasks).map((status) => (
                <div key={status} className="bg-gray-100 p-4 rounded-xl shadow-inner border border-gray-200">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-300">
                    <h2 className={`text-lg font-semibold ${getStatusColor(status)}`}>{status}</h2>
                    <span className="text-xs font-semibold text-gray-600 bg-gray-200 px-2 py-1 rounded-full">
                      {groupedTasks[status].length}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {groupedTasks[status].map((task) => (
                      <div
                        key={task._id}
                        className="bg-white p-4 rounded-lg shadow-md border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-lg hover:transform hover:-translate-y-1"
                        onClick={() => handleTaskClick(task)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(task.priority)}`}>
                            {task.priority || 'N/A'}
                          </span>
                          <span className="text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <FaCalendarAlt className="text-gray-400" />
                              <span>{formatDate(task.deadline)}</span>
                            </div>
                          </span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 leading-tight mb-2">{task.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                        <div className="flex justify-end space-x-2 mt-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleTaskClick(task); }}
                            className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                            title="View Details"
                          >
                            <FaEye className="text-base" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateTaskStatus(task._id, 'Completed'); }}
                            disabled={task.status === 'Completed' || updating === task._id}
                            className={`p-2 rounded-full text-white transition-all duration-200 ${task.status === 'Completed' ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                            title="Mark as Completed"
                          >
                            {updating === task._id ? <FaSpinner className="animate-spin" /> : <FaCheckCircle className="text-sm" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}