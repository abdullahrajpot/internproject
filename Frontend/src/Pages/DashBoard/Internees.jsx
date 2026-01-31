import React, { useState, useMemo, useEffect } from 'react';
import { useUsers } from '../../Contexts/UserContext';
import axios from 'axios';
import {
  FaTrash, FaUserEdit, FaSearch, FaPlus, FaEye, FaDownload, FaFilter,
  FaUserGraduate, FaEnvelope, FaPhone, FaCalendarAlt, FaTasks, FaChartLine,
  FaStar, FaMapMarkerAlt, FaGraduationCap, FaEdit, FaSave, FaTimes,
  FaCheckCircle, FaTimesCircle, FaClock, FaExclamationTriangle
} from 'react-icons/fa';

export default function Internees() {
  const { users, loading, error, getUsersByRole } = useUsers() || {};
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [performanceFilter, setPerformanceFilter] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [selectedInternee, setSelectedInternee] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingInternee, setEditingInternee] = useState(null);
  const [interneeStats, setInterneeStats] = useState({});
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [actionLoading, setActionLoading] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(null);

  const internees = getUsersByRole ? getUsersByRole('intern') : [];

  // Fetch internee statistics
  useEffect(() => {
    const fetchInterneeStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/task/assigned');
        const tasks = response.data || [];
        
        const stats = {};
        internees.forEach(internee => {
          const interneeTasks = tasks.filter(task => 
            task.assignedTo && (task.assignedTo._id === internee._id || task.assignedTo._id === internee.id)
          );
          
          const completed = interneeTasks.filter(t => t.status === 'Completed').length;
          const ongoing = interneeTasks.filter(t => t.status === 'Ongoing').length;
          const pending = interneeTasks.filter(t => t.status === 'Pending').length;
          const overdue = interneeTasks.filter(t => {
            const deadline = new Date(t.deadline);
            return deadline < new Date() && t.status !== 'Completed';
          }).length;
          
          const completionRate = interneeTasks.length > 0 ? (completed / interneeTasks.length * 100).toFixed(1) : 0;
          
          stats[internee._id || internee.id] = {
            totalTasks: interneeTasks.length,
            completed,
            ongoing,
            pending,
            overdue,
            completionRate: parseFloat(completionRate),
            performance: completionRate >= 80 ? 'excellent' : completionRate >= 60 ? 'good' : completionRate >= 40 ? 'average' : 'poor',
            lastActive: new Date().toISOString() // Mock data
          };
        });
        
        setInterneeStats(stats);
      } catch (error) {
        console.error('Error fetching internee stats:', error);
      }
    };

    if (internees.length > 0) {
      fetchInterneeStats();
    }
  }, [internees]);

  // Enhanced filtering and sorting
  const filteredAndSortedInternees = useMemo(() => {
    let filtered = internees.filter(internee => {
      const matchesSearch = internee.name?.toLowerCase().includes(search.toLowerCase()) ||
                           internee.email?.toLowerCase().includes(search.toLowerCase());
      
      const stats = interneeStats[internee._id || internee.id];
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && stats?.totalTasks > 0) ||
        (statusFilter === 'inactive' && (!stats || stats.totalTasks === 0));
      
      const matchesPerformance = performanceFilter === 'all' || 
        (stats && stats.performance === performanceFilter);
      
      return matchesSearch && matchesStatus && matchesPerformance;
    });

    // Sort internees
    filtered.sort((a, b) => {
      const aStats = interneeStats[a._id || a.id] || {};
      const bStats = interneeStats[b._id || b.id] || {};
      
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'performance':
          aValue = aStats.completionRate || 0;
          bValue = bStats.completionRate || 0;
          break;
        case 'tasks':
          aValue = aStats.totalTasks || 0;
          bValue = bStats.totalTasks || 0;
          break;
        case 'joinDate':
          aValue = new Date(a.createdAt || a.dateCreated || 0);
          bValue = new Date(b.createdAt || b.dateCreated || 0);
          break;
        default:
          aValue = a.name || '';
          bValue = b.name || '';
      }
      
      if (typeof aValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [internees, search, statusFilter, performanceFilter, interneeStats, sortBy, sortOrder]);

  const getPerformanceBadge = (performance) => {
    const badges = {
      excellent: 'bg-green-100 text-green-800 border-green-200',
      good: 'bg-blue-100 text-blue-800 border-blue-200',
      average: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      poor: 'bg-red-100 text-red-800 border-red-200'
    };
    return badges[performance] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (stats) => {
    if (!stats || stats.totalTasks === 0) return <FaTimesCircle className="text-gray-400" />;
    if (stats.overdue > 0) return <FaExclamationTriangle className="text-red-500" />;
    if (stats.ongoing > 0) return <FaClock className="text-yellow-500" />;
    return <FaCheckCircle className="text-green-500" />;
  };

  const handleDeleteInternee = async (interneeId) => {
    if (!window.confirm('Are you sure you want to delete this internee? This action cannot be undone.')) {
      return;
    }
    
    setActionLoading(interneeId);
    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${interneeId}`);
      // Context will update automatically
      alert('Internee deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete internee');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditInternee = async (interneeData) => {
    setActionLoading(interneeData.id);
    try {
      await axios.patch(`http://localhost:5000/api/auth/users/${interneeData.id}`, {
        name: interneeData.name,
        email: interneeData.email,
        role: interneeData.role
      });
      setEditingInternee(null);
      alert('Internee updated successfully');
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update internee');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddInternee = async (interneeData) => {
    setActionLoading('add');
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name: interneeData.name,
        email: interneeData.email,
        password: interneeData.password || 'defaultPassword123',
        role: 'intern'
      });
      setShowAddModal(false);
      alert('Internee added successfully');
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Add error:', error);
      alert('Failed to add internee');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAssignTask = async (interneeId, taskData) => {
    setActionLoading(interneeId);
    try {
      const token = localStorage.getItem('token');
      
      // Assign the task
      await axios.post('http://localhost:5000/api/task/assign', {
        title: taskData.title,
        description: taskData.description,
        deadline: taskData.deadline,
        assignedTo: interneeId,
        assignedDate: new Date().toISOString()
      });

      // Send notification to the internee using temporary route
      await axios.post('http://localhost:5000/api/task/send-notification', {
        recipientId: interneeId,
        subject: `New Task Assigned: ${taskData.title}`,
        message: `You have been assigned a new task: "${taskData.title}". Deadline: ${new Date(taskData.deadline).toLocaleDateString()}`
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setShowTaskModal(null);
      alert('Task assigned successfully! The internee will receive a notification.');
      
      // Refresh stats
      const response = await axios.get('http://localhost:5000/api/task/assigned');
      // Update stats logic here
    } catch (error) {
      console.error('Task assignment error:', error);
      alert('Failed to assign task');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendMessage = async (interneeId, messageData) => {
    setActionLoading(interneeId);
    try {
      const token = localStorage.getItem('token');
      
      // Use the temporary task route for now
      const response = await axios.post('http://localhost:5000/api/task/send-message', {
        recipientId: interneeId,
        subject: messageData.subject,
        message: messageData.message
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Message response:', response.data);
      setShowMessageModal(null);
      alert('Message sent successfully! The internee will receive a notification.');
    } catch (error) {
      console.error('Message sending error:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const InterneeCard = ({ internee }) => {
    const stats = interneeStats[internee._id || internee.id] || {};
    
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {internee.name?.charAt(0)?.toUpperCase() || 'I'}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{internee.name}</h3>
              <p className="text-sm text-gray-600">{internee.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(stats)}
            <button
              onClick={() => setSelectedInternee(internee)}
              className="text-blue-600 hover:text-blue-800"
            >
              <FaEye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.totalTasks || 0}</div>
            <div className="text-xs text-gray-600">Total Tasks</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.completionRate || 0}%</div>
            <div className="text-xs text-gray-600">Completion</div>
          </div>
        </div>

        {/* Performance Badge */}
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPerformanceBadge(stats.performance)}`}>
            {stats.performance ? stats.performance.charAt(0).toUpperCase() + stats.performance.slice(1) : 'No Data'}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setEditingInternee(internee)}
              className="text-yellow-600 hover:text-yellow-800"
              disabled={actionLoading === (internee._id || internee.id)}
            >
              {actionLoading === (internee._id || internee.id) ? (
                <div className="animate-spin w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full"></div>
              ) : (
                <FaEdit className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => handleDeleteInternee(internee._id || internee.id)}
              className="text-red-600 hover:text-red-800"
              disabled={actionLoading === (internee._id || internee.id)}
            >
              {actionLoading === (internee._id || internee.id) ? (
                <div className="animate-spin w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
              ) : (
                <FaTrash className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Internee Management</h1>
            <p className="text-gray-600 mt-1">Manage and monitor all internees in your program</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search internees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 text-sm"
              />
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <FaPlus className="w-4 h-4" />
              Add Internee
            </button>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={performanceFilter}
            onChange={(e) => setPerformanceFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Performance</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="average">Average</option>
            <option value="poor">Poor</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="performance">Sort by Performance</option>
            <option value="tasks">Sort by Tasks</option>
            <option value="joinDate">Sort by Join Date</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'cards' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Table
            </button>
          </div>

          <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
            <FaDownload className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{filteredAndSortedInternees.length}</div>
                <div className="text-sm text-gray-500">Total Internees</div>
              </div>
              <FaUserGraduate className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {filteredAndSortedInternees.filter(i => interneeStats[i._id || i.id]?.totalTasks > 0).length}
                </div>
                <div className="text-sm text-gray-500">Active Internees</div>
              </div>
              <FaCheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Object.values(interneeStats).reduce((sum, stats) => sum + (stats.completionRate || 0), 0) / Math.max(Object.keys(interneeStats).length, 1) || 0}%
                </div>
                <div className="text-sm text-gray-500">Avg Completion</div>
              </div>
              <FaChartLine className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {filteredAndSortedInternees.filter(i => interneeStats[i._id || i.id]?.performance === 'excellent').length}
                </div>
                <div className="text-sm text-gray-500">Top Performers</div>
              </div>
              <FaStar className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
          </div>
        ) : filteredAndSortedInternees.length === 0 ? (
          <div className="text-center py-12">
            <FaUserGraduate className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Internees Found</h3>
            <p className="text-gray-600">No internees match your current search and filter criteria.</p>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedInternees.map(internee => (
              <InterneeCard key={internee._id || internee.id} internee={internee} />
            ))}
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
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tasks
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
                  {filteredAndSortedInternees.map(internee => {
                    const stats = interneeStats[internee._id || internee.id] || {};
                    
                    return (
                      <tr key={internee._id || internee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {internee.name?.charAt(0)?.toUpperCase() || 'I'}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{internee.name}</div>
                              <div className="text-sm text-gray-500">{internee.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{stats.completionRate || 0}%</div>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPerformanceBadge(stats.performance)}`}>
                              {stats.performance || 'No Data'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>{stats.totalTasks || 0} Total</div>
                            <div className="text-xs text-gray-500">
                              {stats.completed || 0} Completed, {stats.ongoing || 0} Ongoing
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(stats)}
                            <span className="ml-2 text-sm text-gray-900">
                              {stats.totalTasks > 0 ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedInternee(internee)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingInternee(internee)}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteInternee(internee._id || internee.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
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

      {/* Detailed View Modal */}
      {selectedInternee && (
        <InterneeDetailModal 
          internee={selectedInternee} 
          stats={interneeStats[selectedInternee._id || selectedInternee.id] || {}}
          onClose={() => setSelectedInternee(null)}
          onAssignTask={(taskData) => handleAssignTask(selectedInternee._id || selectedInternee.id, taskData)}
          onSendMessage={(messageData) => handleSendMessage(selectedInternee._id || selectedInternee.id, messageData)}
          loading={actionLoading === (selectedInternee._id || selectedInternee.id)}
        />
      )}

      {/* Add Internee Modal */}
      {showAddModal && (
        <AddInterneeModal 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddInternee}
          loading={actionLoading === 'add'}
        />
      )}

      {/* Edit Internee Modal */}
      {editingInternee && (
        <EditInterneeModal 
          internee={editingInternee}
          onClose={() => setEditingInternee(null)}
          onSave={handleEditInternee}
          loading={actionLoading === (editingInternee._id || editingInternee.id)}
        />
      )}
    </div>
  );
}

// Add Internee Modal Component
const AddInterneeModal = ({ onClose, onAdd, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add New Internee</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Leave empty for default password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Internee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Internee Modal Component
const EditInterneeModal = ({ internee, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    id: internee._id || internee.id,
    name: internee.name || '',
    email: internee.email || '',
    role: internee.role || 'intern'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Internee</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="intern">Intern</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Detailed View Modal Component
const InterneeDetailModal = ({ internee, stats, onClose, onAssignTask, onSendMessage, loading }) => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    deadline: ''
  });
  const [messageData, setMessageData] = useState({
    subject: '',
    message: '',
    email: internee.email
  });

  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!taskData.title || !taskData.description || !taskData.deadline) {
      alert('Please fill in all task fields');
      return;
    }
    onAssignTask(taskData);
    setShowTaskForm(false);
    setTaskData({ title: '', description: '', deadline: '' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageData.subject || !messageData.message) {
      alert('Please fill in all message fields');
      return;
    }
    onSendMessage(messageData);
    setShowMessageForm(false);
    setMessageData({ subject: '', message: '', email: internee.email });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {internee.name?.charAt(0)?.toUpperCase() || 'I'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{internee.name}</h2>
              <p className="text-gray-600">{internee.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.totalTasks || 0}</div>
                <div className="text-sm text-blue-800">Total Tasks</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.completed || 0}</div>
                <div className="text-sm text-green-800">Completed</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{stats.ongoing || 0}</div>
                <div className="text-sm text-yellow-800">Ongoing</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.overdue || 0}</div>
                <div className="text-sm text-red-800">Overdue</div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completion Rate</span>
                    <span className="font-medium">{stats.completionRate || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.completionRate || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="pt-2">
                  <span className="text-sm text-gray-600">Performance Level:</span>
                  <div className={`inline-block ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                    stats.performance === 'excellent' ? 'bg-green-100 text-green-800' :
                    stats.performance === 'good' ? 'bg-blue-100 text-blue-800' :
                    stats.performance === 'average' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {stats.performance ? stats.performance.charAt(0).toUpperCase() + stats.performance.slice(1) : 'No Data'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FaEnvelope className="text-gray-400" />
                  <span className="text-sm text-gray-600">{internee.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Joined: {new Date(internee.createdAt || internee.dateCreated || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setShowTaskForm(true)}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <FaTasks className="w-4 h-4" />
                  <span>{loading ? 'Processing...' : 'Assign Task'}</span>
                </button>
                <button 
                  onClick={() => setShowMessageForm(true)}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <FaEnvelope className="w-4 h-4" />
                  <span>{loading ? 'Processing...' : 'Send Message'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Task Assignment Form */}
          {showTaskForm && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Assign New Task</h4>
              <form onSubmit={handleAssignTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                  <input
                    type="text"
                    value={taskData.title}
                    onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={taskData.description}
                    onChange={(e) => setTaskData({...taskData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input
                    type="datetime-local"
                    value={taskData.deadline}
                    onChange={(e) => setTaskData({...taskData, deadline: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowTaskForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Assigning...' : 'Assign Task'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Message Form */}
          {showMessageForm && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Send Message</h4>
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={messageData.subject}
                    onChange={(e) => setMessageData({...messageData, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={messageData.message}
                    onChange={(e) => setMessageData({...messageData, message: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowMessageForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 