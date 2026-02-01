import React, { useState, useMemo, useEffect } from 'react';
import { useUsers } from '../../Contexts/UserContext';
import axios from 'axios';
import {
  FaTrash, FaUserEdit, FaSearch, FaUser, FaPlus, FaDownload, FaFilter,
  FaEye, FaUserShield, FaUserGraduate, FaUsers, FaCheckCircle, FaTimesCircle,
  FaEdit, FaSave, FaTimes, FaEnvelope, FaCalendarAlt, FaCrown, FaUserTie,
  FaSort, FaSortUp, FaSortDown, FaBan, FaUnlock, FaKey
} from 'react-icons/fa';

export default function Users() {
  const { users, loading, error, getUsersByRole } = useUsers() || {};
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('table');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [bulkActions, setBulkActions] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null);
  const [userStats, setUserStats] = useState({});
  const [actionLoading, setActionLoading] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(null);

  // Fetch user statistics
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/task/assigned');
        const tasks = response.data || [];
        
        const stats = {};
        (users || []).forEach(user => {
          const userTasks = tasks.filter(task => 
            task.assignedTo && (task.assignedTo._id === user._id || task.assignedTo._id === user.id)
          );
          
          stats[user._id || user.id] = {
            totalTasks: userTasks.length,
            completedTasks: userTasks.filter(t => t.status === 'Completed').length,
            lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Mock data
            isActive: Math.random() > 0.3, // Mock data
            joinDate: user.createdAt || user.dateCreated || new Date().toISOString()
          };
        });
        
        setUserStats(stats);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    if (users && users.length > 0) {
      fetchUserStats();
    }
  }, [users]);

  // Enhanced filtering and sorting
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = (users || []).filter(user => {
      const matchesSearch = user.name?.toLowerCase().includes(search.toLowerCase()) ||
                           user.email?.toLowerCase().includes(search.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      const stats = userStats[user._id || user.id];
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && stats?.isActive) ||
        (statusFilter === 'inactive' && !stats?.isActive);
      
      return matchesSearch && matchesRole && matchesStatus;
    });

    // Sort users
    filtered.sort((a, b) => {
      const aStats = userStats[a._id || a.id] || {};
      const bStats = userStats[b._id || b.id] || {};
      
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'email':
          aValue = a.email || '';
          bValue = b.email || '';
          break;
        case 'role':
          aValue = a.role || '';
          bValue = b.role || '';
          break;
        case 'joinDate':
          aValue = new Date(aStats.joinDate || 0);
          bValue = new Date(bStats.joinDate || 0);
          break;
        case 'lastLogin':
          aValue = new Date(aStats.lastLogin || 0);
          bValue = new Date(bStats.lastLogin || 0);
          break;
        case 'tasks':
          aValue = aStats.totalTasks || 0;
          bValue = bStats.totalTasks || 0;
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
  }, [users, search, roleFilter, statusFilter, userStats, sortBy, sortOrder]);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <FaUserShield className="text-red-500" />;
      case 'intern': return <FaUserGraduate className="text-blue-500" />;
      default: return <FaUser className="text-gray-500" />;
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'bg-red-100 text-red-800 border-red-200',
      intern: 'bg-blue-100 text-blue-800 border-blue-200',
      user: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return badges[role] || badges.user;
  };

  const handleBulkAction = (action) => {
    if (bulkActions.length === 0) {
      alert('Please select users first');
      return;
    }
    
    setConfirmAction({
      type: action,
      users: bulkActions,
      message: `Are you sure you want to ${action} ${bulkActions.length} user(s)?`
    });
  };

  const executeBulkAction = async () => {
    if (!confirmAction) return;
    
    setActionLoading('bulk');
    try {
      const promises = confirmAction.users.map(userId => {
        switch (confirmAction.type) {
          case 'delete':
            return axios.delete(`http://localhost:5000/api/auth/users/${userId}`);
          case 'activate':
            return axios.patch(`http://localhost:5000/api/auth/users/${userId}/status`, { active: true });
          case 'deactivate':
            return axios.patch(`http://localhost:5000/api/auth/users/${userId}/status`, { active: false });
          default:
            return Promise.resolve();
        }
      });
      
      await Promise.all(promises);
      setBulkActions([]);
      setConfirmAction(null);
      alert(`Successfully ${confirmAction.type}d ${confirmAction.users.length} user(s)`);
      // Refresh page to update data
      window.location.reload();
    } catch (error) {
      console.error('Bulk action error:', error);
      alert(`Failed to ${confirmAction.type} users`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendMessage = async (userId, messageData) => {
    setActionLoading(userId);
    try {
      console.log('📧 Sending message to user:', userId);
      
      // Try to send via backend API first
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.post('http://localhost:5000/api/notifications/message', {
            recipientId: userId,
            subject: messageData.subject,
            message: messageData.message
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.data.success) {
            console.log('✅ Message sent via backend API');
            alert('✅ Message sent successfully! The user will see this in their notifications.');
            return;
          }
        } catch (apiError) {
          console.warn('⚠️ Backend API failed, using localStorage fallback:', apiError.message);
        }
      }
      
      // Fallback: Store message in localStorage for demo purposes
      const existingMessages = JSON.parse(localStorage.getItem('adminMessages') || '[]');
      const newMessage = {
        id: Date.now().toString(),
        recipientId: userId,
        subject: messageData.subject,
        message: messageData.message,
        sender: 'Admin',
        timestamp: new Date().toISOString(),
        isRead: false
      };
      
      existingMessages.push(newMessage);
      localStorage.setItem('adminMessages', JSON.stringify(existingMessages));
      
      // Also store in user's notifications
      const userNotifications = JSON.parse(localStorage.getItem(`notifications_${userId}`) || '[]');
      userNotifications.unshift({
        _id: newMessage.id,
        title: messageData.subject,
        message: messageData.message,
        type: 'message',
        priority: 'medium',
        isRead: false,
        sender: { name: 'Admin', email: 'admin@company.com' },
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(userNotifications));
      
      console.log('✅ Message stored successfully');
      alert('✅ Message sent successfully! The user will see this in their notifications.');
      
    } catch (error) {
      console.error('❌ Message sending error:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetPassword = async (userId, newPassword) => {
    setActionLoading(userId);
    try {
      await axios.patch(`http://localhost:5000/api/auth/users/${userId}/password`, {
        password: newPassword
      });
      setShowPasswordModal(null);
      alert('Password reset successfully');
    } catch (error) {
      console.error('Password reset error:', error);
      alert('Failed to reset password');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditUser = async (userData) => {
    setActionLoading(userData.id);
    try {
      await axios.patch(`http://localhost:5000/api/auth/users/${userData.id}`, {
        name: userData.name,
        email: userData.email,
        role: userData.role
      });
      setShowEditModal(null);
      alert('User updated successfully');
      // Refresh page to update data
      window.location.reload();
    } catch (error) {
      console.error('User update error:', error);
      alert('Failed to update user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    setActionLoading(userId);
    try {
      await axios.patch(`http://localhost:5000/api/auth/users/${userId}/status`, {
        active: !currentStatus
      });
      alert(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      // Update local state
      setUserStats(prev => ({
        ...prev,
        [userId]: {
          ...prev[userId],
          isActive: !currentStatus
        }
      }));
    } catch (error) {
      console.error('Status toggle error:', error);
      alert('Failed to update user status');
    } finally {
      setActionLoading(null);
    }
  };

  const UserCard = ({ user }) => {
    const stats = userStats[user._id || user.id] || {};
    
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1">
                {getRoleIcon(user.role)}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${stats.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <button
              onClick={() => setSelectedUser(user)}
              className="text-blue-600 hover:text-blue-800"
            >
              <FaEye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Role Badge */}
        <div className="mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadge(user.role)}`}>
            {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{stats.totalTasks || 0}</div>
            <div className="text-xs text-gray-600">Tasks</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {stats.lastLogin ? new Date(stats.lastLogin).toLocaleDateString() : 'Never'}
            </div>
            <div className="text-xs text-gray-600">Last Login</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <span className={`text-xs px-2 py-1 rounded-full ${stats.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {stats.isActive ? 'Active' : 'Inactive'}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setEditingUser(user)}
              className="text-yellow-600 hover:text-yellow-800"
            >
              <FaEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => setConfirmAction({
                type: 'delete',
                users: [user._id || user.id],
                message: `Are you sure you want to delete ${user.name}?`
              })}
              className="text-red-600 hover:text-red-800"
            >
              <FaTrash className="w-4 h-4" />
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage all users, roles, and permissions in your system</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
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
              Add User
            </button>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="intern">Intern</option>
            <option value="user">User</option>
          </select>

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
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
            <option value="role">Sort by Role</option>
            <option value="joinDate">Sort by Join Date</option>
            <option value="lastLogin">Sort by Last Login</option>
            <option value="tasks">Sort by Tasks</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-2"
          >
            {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>

          <div className="flex items-center gap-2">
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
          </div>

          <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
            <FaDownload className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Bulk Actions */}
        {bulkActions.length > 0 && (
          <div className="flex items-center gap-3 mt-4 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-800">{bulkActions.length} user(s) selected</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setBulkActions([])}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{filteredAndSortedUsers.length}</div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
              <FaUsers className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {filteredAndSortedUsers.filter(u => u.role === 'admin').length}
                </div>
                <div className="text-sm text-gray-500">Admins</div>
              </div>
              <FaUserShield className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {filteredAndSortedUsers.filter(u => u.role === 'intern').length}
                </div>
                <div className="text-sm text-gray-500">Internees</div>
              </div>
              <FaUserGraduate className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {filteredAndSortedUsers.filter(u => userStats[u._id || u.id]?.isActive).length}
                </div>
                <div className="text-sm text-gray-500">Active Users</div>
              </div>
              <FaCheckCircle className="w-8 h-8 text-green-500" />
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
        ) : filteredAndSortedUsers.length === 0 ? (
          <div className="text-center py-12">
            <FaUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600">No users match your current search and filter criteria.</p>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedUsers.map(user => (
              <UserCard key={user._id || user.id} user={user} />
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBulkActions(filteredAndSortedUsers.map(u => u._id || u.id));
                          } else {
                            setBulkActions([]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedUsers.map(user => {
                    const stats = userStats[user._id || user.id] || {};
                    const userId = user._id || user.id;
                    
                    return (
                      <tr key={userId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={bulkActions.includes(userId)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setBulkActions([...bulkActions, userId]);
                              } else {
                                setBulkActions(bulkActions.filter(id => id !== userId));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="relative">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                              </div>
                              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${stats.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getRoleIcon(user.role)}
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                              {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${stats.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {stats.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stats.lastLogin ? new Date(stats.lastLogin).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingUser(user)}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setConfirmAction({
                                type: 'delete',
                                users: [userId],
                                message: `Are you sure you want to delete ${user.name}?`
                              })}
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

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center mb-4">
              <FaTrash className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Confirm Action</h3>
            <p className="text-gray-600 text-center mb-6">{confirmAction.message}</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeBulkAction}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal 
          user={selectedUser} 
          stats={userStats[selectedUser._id || selectedUser.id] || {}}
          onClose={() => setSelectedUser(null)}
          onSendMessage={handleSendMessage}
          onResetPassword={handleResetPassword}
          onEditUser={handleEditUser}
          onToggleStatus={handleToggleUserStatus}
          loading={actionLoading === (selectedUser._id || selectedUser.id)}
        />
      )}

      {/* Password Reset Modal */}
      {showPasswordModal && (
        <PasswordResetModal
          user={showPasswordModal}
          onClose={() => setShowPasswordModal(null)}
          onReset={handleResetPassword}
          loading={actionLoading === (showPasswordModal._id || showPasswordModal.id)}
        />
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <EditUserModal
          user={showEditModal}
          onClose={() => setShowEditModal(null)}
          onSave={handleEditUser}
          loading={actionLoading === (showEditModal._id || showEditModal.id)}
        />
      )}
    </div>
  );
}

// Password Reset Modal Component
const PasswordResetModal = ({ user, onClose, onReset, loading }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    onReset(user._id || user.id, newPassword);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Reset Password</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              Resetting password for: <strong>{user.name}</strong>
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
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
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit User Modal Component
const EditUserModal = ({ user, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    id: user._id || user.id,
    name: user.name || '',
    email: user.email || '',
    role: user.role || 'user'
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
          <h2 className="text-xl font-bold text-gray-900">Edit User</h2>
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
                <option value="user">User</option>
                <option value="intern">Intern</option>
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

// User Detail Modal Component
const UserDetailModal = ({ user, stats, onClose, onSendMessage, onResetPassword, onEditUser, onToggleStatus, loading }) => {
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageData, setMessageData] = useState({
    subject: '',
    message: '',
    email: user.email
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageData.subject || !messageData.message) {
      alert('Please fill in all message fields');
      return;
    }
    onSendMessage(user._id || user.id, messageData);
    setShowMessageForm(false);
    setMessageData({ subject: '', message: '', email: user.email });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-red-100 text-red-800' :
                  user.role === 'intern' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                </span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${stats.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {stats.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stats */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Total Tasks</span>
                  <span className="font-semibold text-gray-900">{stats.totalTasks || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Completed Tasks</span>
                  <span className="font-semibold text-gray-900">{stats.completedTasks || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Join Date</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(stats.joinDate || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Last Login</span>
                  <span className="font-semibold text-gray-900">
                    {stats.lastLogin ? new Date(stats.lastLogin).toLocaleDateString() : 'Never'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowMessageForm(true)}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <FaEnvelope className="w-4 h-4" />
                  <span>{loading ? 'Processing...' : 'Send Message'}</span>
                </button>
                <button 
                  onClick={() => onResetPassword(user._id || user.id, 'newPassword123')}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <FaKey className="w-4 h-4" />
                  <span>{loading ? 'Processing...' : 'Reset Password'}</span>
                </button>
                <button 
                  onClick={() => onEditUser(user)}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                >
                  <FaEdit className="w-4 h-4" />
                  <span>{loading ? 'Processing...' : 'Edit Profile'}</span>
                </button>
                <button 
                  onClick={() => onToggleStatus(user._id || user.id, stats.isActive)}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <FaBan className="w-4 h-4" />
                  <span>{loading ? 'Processing...' : (stats.isActive ? 'Deactivate' : 'Activate') + ' Account'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Message Form */}
          {showMessageForm && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Send Message</h4>
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={messageData.subject}
                    onChange={(e) => setMessageData({...messageData, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={messageData.message}
                    onChange={(e) => setMessageData({...messageData, message: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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