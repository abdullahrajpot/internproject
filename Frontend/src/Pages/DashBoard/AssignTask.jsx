import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../Contexts/AuthContext';
import { useUsers } from '../../Contexts/UserContext';
import { 
  FaTasks, 
  FaTrash, 
  FaFileAlt, 
  FaUser, 
  FaCalendarAlt, 
  FaPlus, 
  FaClock,
  FaEye,
  FaEdit,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaDownload,
  FaFilter,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';

export default function AssignTask() {
  const { user } = useAuth();
  const { users, loading, error: userError, getUsersByRole } = useUsers() || {};
  const location = useLocation();
  const internees = getUsersByRole ? getUsersByRole('intern') : [];
  
  // Get pre-selected internee from navigation state
  const preSelectedInternee = location.state?.preSelectedInternee;
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: '',
    assignedDate: new Date().toISOString().slice(0, 10),
    file: null,
    internId: preSelectedInternee?.id || '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch previously assigned tasks
  useEffect(() => {
    setTasksLoading(true);
    axios.get('http://localhost:5000/api/task/assigned')
      .then(res => {
        // Add status and priority to tasks if not present
        const tasksWithStatus = res.data.map(task => ({
          ...task,
          status: task.status || getTaskStatus(task),
          priority: task.priority || 'medium'
        }));
        setTasks(tasksWithStatus);
      })
      .catch(() => setError('Failed to fetch assigned tasks.'))
      .finally(() => setTasksLoading(false));
  }, [success]); // refetch on new assignment

  // Helper function to determine task status
  const getTaskStatus = (task) => {
    if (task.status) return task.status;
    const now = new Date();
    const deadline = new Date(task.deadline);
    
    if (task.completed) return 'completed';
    if (deadline < now) return 'overdue';
    if (deadline - now < 24 * 60 * 60 * 1000) return 'urgent'; // Less than 24 hours
    return 'pending';
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper function to get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.assignedTo?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || getTaskStatus(task) === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'deadline':
          aValue = new Date(a.deadline);
          bValue = new Date(b.deadline);
          break;
        case 'assignedDate':
          aValue = new Date(a.assignedDate);
          bValue = new Date(b.assignedDate);
          break;
        case 'assignedTo':
          aValue = a.assignedTo?.name.toLowerCase() || '';
          bValue = b.assignedTo?.name.toLowerCase() || '';
          break;
        case 'status':
          aValue = getTaskStatus(a);
          bValue = getTaskStatus(b);
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Handle sort
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (column) => {
    if (sortBy !== column) return <FaSort className="w-3 h-3 text-gray-400" />;
    return sortOrder === 'asc' ? 
      <FaSortUp className="w-3 h-3 text-blue-600" /> : 
      <FaSortDown className="w-3 h-3 text-blue-600" />;
  };

  if (!user || user.role !== 'admin') {
    return <div className="p-8 text-red-600 font-bold">Access denied. Admins only.</div>;
  }

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('deadline', form.deadline);
      formData.append('assignedDate', form.assignedDate);
      formData.append('file', form.file);
      formData.append('assignedTo', form.internId);
      await axios.post('http://localhost:5000/api/task/assign', formData);
      setSuccess('Task assigned successfully!');
      setForm({ 
        title: '', 
        description: '', 
        deadline: '', 
        assignedDate: new Date().toISOString().slice(0, 10), 
        file: null, 
        internId: '' 
      });
    } catch (err) {
      setError('Failed to assign task.');
    }
  };

  const handleDelete = async (taskId) => {
    setDeleteLoading(taskId);
    setError('');
    try {
      await axios.delete(`http://localhost:5000/api/task/${taskId}`);
      setTasks(tasks => tasks.filter(t => t.id !== taskId && t._id !== taskId));
    } catch (err) {
      setError('Failed to delete task.');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <>
    <div className="max-w-5xl mx-auto mt-10">
      {/* Card Layout for Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <FaPlus className="text-green-600 text-2xl" />
          <h1 className="text-2xl font-bold text-gray-900">Assign Task to Intern</h1>
          {preSelectedInternee && (
            <div className="ml-auto bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Pre-selected: {preSelectedInternee.name}
            </div>
          )}
        </div>
        {success && <div className="mb-4 text-green-600 font-semibold">{success}</div>}
        {(error || userError) && <div className="mb-4 text-red-600 font-semibold">{error || userError}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1">Task Title</label>
            <div className="flex items-center gap-2">
              <FaTasks className="text-gray-400" />
              <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Task Description</label>
            <div className="flex items-center gap-2">
              <FaTasks className="text-gray-400" />
              <input type="text" name="description" value={form.description} onChange={handleChange} required className="w-full border rounded px-3 py-2 " />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Deadline Date & Time</label>
            <div className="flex items-center gap-2 mb-2">
              <FaCalendarAlt className="text-gray-400" />
              <input 
                type="datetime-local" 
                name="deadline" 
                value={form.deadline} 
                onChange={handleChange} 
                required 
                className="w-full border rounded px-3 py-2" 
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => {
                  const tomorrow9AM = new Date();
                  tomorrow9AM.setDate(tomorrow9AM.getDate() + 1);
                  tomorrow9AM.setHours(9, 0, 0, 0);
                  setForm(f => ({ ...f, deadline: tomorrow9AM.toISOString().slice(0, 16) }));
                }}
                className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition"
              >
                Tomorrow 9 AM
              </button>
              <button
                type="button"
                onClick={() => {
                  const nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  nextWeek.setHours(17, 0, 0, 0);
                  setForm(f => ({ ...f, deadline: nextWeek.toISOString().slice(0, 16) }));
                }}
                className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded hover:bg-green-200 transition"
              >
                Next Week 5 PM
              </button>
              <button
                type="button"
                onClick={() => {
                  const endOfWeek = new Date();
                  const daysUntilFriday = (5 - endOfWeek.getDay() + 7) % 7 || 7;
                  endOfWeek.setDate(endOfWeek.getDate() + daysUntilFriday);
                  endOfWeek.setHours(17, 0, 0, 0);
                  setForm(f => ({ ...f, deadline: endOfWeek.toISOString().slice(0, 16) }));
                }}
                className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded hover:bg-orange-200 transition"
              >
                End of Week
              </button>
            </div>
            <p className="text-xs text-gray-500">Select both date and time for precise scheduling in calendar</p>
          </div>
          <div>
            <label className="block font-semibold mb-1">Assigned Date</label>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-400" />
              <input type="date" name="assignedDate" value={form.assignedDate} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">File (PDF/Word)</label>
            <div className="flex items-center gap-2">
              <FaFileAlt className="text-gray-400" />
              <input type="file" name="file" accept=".pdf,.doc,.docx" onChange={handleChange} required className="w-full" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Assign To</label>
            <div className="flex items-center gap-2">
              <FaUser className="text-gray-400" />
              <select name="internId" value={form.internId} onChange={handleChange} required className="w-full border rounded px-3 py-2" disabled={loading}>
                <option value="">{loading ? 'Loading...' : 'Select Intern'}</option>
                {internees.map(intern => (
                  <option key={intern.id || intern._id} value={intern.id || intern._id}>
                    {intern.name} ({intern.email})
                    {preSelectedInternee && (intern.id === preSelectedInternee.id || intern._id === preSelectedInternee.id) && ' - Pre-selected'}
                  </option>
                ))}
              </select>
            </div>
            {preSelectedInternee && (
              <p className="text-sm text-blue-600 mt-1">
                ℹ️ This internee was pre-selected from the internees page. You can change the selection if needed.
              </p>
            )}
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-2 rounded-lg font-semibold shadow hover:from-green-600 hover:to-green-700 transition flex items-center gap-2">
              <FaPlus /> Assign Task
            </button>
          </div>
        </form>
      </div>

      {/* Assigned Tasks Grid */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaTasks className="text-blue-600 text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Task Management</h2>
                <p className="text-sm text-gray-500">{filteredAndSortedTasks.length} of {tasks.length} tasks</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Total Tasks:</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {tasks.length}
              </span>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search tasks, descriptions, or assignees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="urgent">Urgent</option>
                <option value="overdue">Overdue</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="p-6">
          {tasksLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span>Loading tasks...</span>
              </div>
            </div>
          ) : filteredAndSortedTasks.length === 0 ? (
            <div className="text-center py-12">
              <FaTasks className="mx-auto text-gray-300 text-4xl mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {tasks.length === 0 ? 'No tasks assigned yet' : 'No tasks match your filters'}
              </h3>
              <p className="text-gray-500">
                {tasks.length === 0 
                  ? 'Start by assigning your first task to an intern above.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th 
                      className="text-left py-4 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Task Title</span>
                        {getSortIcon('title')}
                      </div>
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Description
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th 
                      className="text-left py-4 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSort('deadline')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Deadline</span>
                        {getSortIcon('deadline')}
                      </div>
                    </th>
                    <th 
                      className="text-left py-4 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSort('assignedTo')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Assigned To</span>
                        {getSortIcon('assignedTo')}
                      </div>
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Attachment
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAndSortedTasks.map((task, idx) => (
                    <tr 
                      key={task.id || task._id} 
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      {/* Task Title */}
                      <td className="py-4 px-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {task.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              ID: {(task.id || task._id).slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-4 px-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(getTaskStatus(task))}`}>
                          {getTaskStatus(task) === 'completed' && <FaCheckCircle className="w-3 h-3" />}
                          {getTaskStatus(task) === 'overdue' && <FaTimesCircle className="w-3 h-3" />}
                          {getTaskStatus(task) === 'urgent' && <FaExclamationTriangle className="w-3 h-3" />}
                          {getTaskStatus(task) === 'pending' && <FaClock className="w-3 h-3" />}
                          {getTaskStatus(task).charAt(0).toUpperCase() + getTaskStatus(task).slice(1)}
                        </span>
                      </td>

                      {/* Deadline */}
                      <td className="py-4 px-4">
                        {task.deadline ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {new Date(task.deadline).toLocaleDateString(undefined, { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaClock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {new Date(task.deadline).toLocaleTimeString(undefined, { 
                                  hour: '2-digit', 
                                  minute: '2-digit', 
                                  hour12: true 
                                })}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">No deadline</span>
                        )}
                      </td>

                      {/* Assigned To */}
                      <td className="py-4 px-4">
                        {task.assignedTo?.name ? (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {task.assignedTo.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {task.assignedTo.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {task.assignedTo.email}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Unassigned</span>
                        )}
                      </td>

                      {/* File Attachment */}
                      <td className="py-4 px-4">
                        {task.file ? (
                          <a
                            href={`http://localhost:5000/${task.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <FaDownload className="w-3 h-3" />
                            <span className="text-sm font-medium">Download</span>
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">No file</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedTask(task)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="View Details"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(task.id || task._id)}
                            disabled={deleteLoading === (task.id || task._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                            title="Delete Task"
                          >
                            {deleteLoading === (task.id || task._id) ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <FaTrash className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Task Details</h3>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <FaTimesCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Title</h4>
                <p className="text-gray-700">{selectedTask.title}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700 leading-relaxed">{selectedTask.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(getTaskStatus(selectedTask))}`}>
                    {getTaskStatus(selectedTask).charAt(0).toUpperCase() + getTaskStatus(selectedTask).slice(1)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Assigned To</h4>
                  <p className="text-gray-700">{selectedTask.assignedTo?.name || 'Unassigned'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Deadline</h4>
                  <p className="text-gray-700">
                    {selectedTask.deadline 
                      ? new Date(selectedTask.deadline).toLocaleString()
                      : 'No deadline set'
                    }
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Assigned Date</h4>
                  <p className="text-gray-700">
                    {selectedTask.assignedDate 
                      ? new Date(selectedTask.assignedDate).toLocaleDateString()
                      : 'Not specified'
                    }
                  </p>
                </div>
              </div>
              {selectedTask.file && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Attachment</h4>
                  <a
                    href={`http://localhost:5000/${selectedTask.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <FaDownload className="w-4 h-4" />
                    <span>Download File</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
} 