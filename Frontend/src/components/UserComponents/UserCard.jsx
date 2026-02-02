import React from 'react';
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaUserShield,
  FaUserGraduate,
  FaUser
} from 'react-icons/fa';

const UserCard = ({ user, stats, onView, onEdit, onDelete, loading }) => {
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
          <div className={`w-3 h-3 rounded-full ${stats?.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <button
            onClick={() => onView(user)}
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
          <div className="text-lg font-bold text-gray-900">{stats?.totalTasks || 0}</div>
          <div className="text-xs text-gray-600">Tasks</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">
            {stats?.lastLogin ? new Date(stats.lastLogin).toLocaleDateString() : 'Never'}
          </div>
          <div className="text-xs text-gray-600">Last Login</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <span className={`text-xs px-2 py-1 rounded-full ${stats?.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {stats?.isActive ? 'Active' : 'Inactive'}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(user)}
            className="text-yellow-600 hover:text-yellow-800"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full"></div>
            ) : (
              <FaEdit className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => onDelete(user)}
            className="text-red-600 hover:text-red-800"
            disabled={loading}
          >
            {loading ? (
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

export default UserCard;