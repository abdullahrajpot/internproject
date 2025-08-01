import React, { useState } from 'react';
import { useUsers } from '../../Contexts/UserContext';
import axios from 'axios';
import { FaTrash, FaUserEdit, FaSearch, FaUser } from 'react-icons/fa';

export default function Users() {
  const { users, loading, error, getUsersByRole } = useUsers() || {};
  const [search, setSearch] = useState('');
  const [roleEdit, setRoleEdit] = useState({}); // { userId: newRole }
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [roleLoading, setRoleLoading] = useState(null);
  const [localUsers, setLocalUsers] = useState(users || []);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actionMsg, setActionMsg] = useState('');

  React.useEffect(() => {
    setLocalUsers(users || []);
  }, [users]);

  const handleSearch = e => {
    setSearch(e.target.value);
    if (!e.target.value) {
      setLocalUsers(users || []);
    } else {
      setLocalUsers(
        (users || []).filter(u =>
          u.name?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          u.email?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          u.role?.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  };

  const handleDelete = async (userId) => {
    setDeleteLoading(userId);
    setActionMsg('');
    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${userId}`);
      setLocalUsers(localUsers.filter(u => u.id !== userId && u._id !== userId));
      setActionMsg('User deleted successfully!');
    } catch {
      setActionMsg('Failed to delete user');
    } finally {
      setDeleteLoading(null);
      setConfirmDelete(null);
      setTimeout(() => setActionMsg(''), 2000);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setRoleEdit({ ...roleEdit, [userId]: newRole });
  };

  const handleRoleUpdate = async (userId) => {
    setRoleLoading(userId);
    setActionMsg('');
    try {
      await axios.patch(`http://localhost:5000/api/auth/users/${userId}/role`, { role: roleEdit[userId] });
      setLocalUsers(localUsers.map(u => (u.id === userId || u._id === userId) ? { ...u, role: roleEdit[userId] } : u));
      setRoleEdit({ ...roleEdit, [userId]: undefined });
      setActionMsg('Role updated!');
    } catch {
      setActionMsg('Failed to update role');
    } finally {
      setRoleLoading(null);
      setTimeout(() => setActionMsg(''), 2000);
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') return 'bg-green-100 text-green-700';
    if (role === 'intern') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      {/* Header Section */}
      <div className="rounded-2xl bg-gradient-to-r from-green-400 to-blue-400 p-8 mb-8 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">All Users</h1>
          <p className="text-white/80">Manage all users in your platform</p>
        </div>
        <div className="flex items-center gap-2 bg-white/80 rounded px-3 py-2 shadow-inner">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={handleSearch}
            className="bg-transparent outline-none px-2"
          />
        </div>
        <div className="text-white font-bold text-xl">Total: {localUsers.length}</div>
      </div>
      {/* Action Message */}
      {actionMsg && <div className="mb-4 text-center text-white bg-green-500 rounded py-2 animate-fade-in">{actionMsg}</div>}
      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 border border-gray-100">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <svg className="animate-spin h-8 w-8 text-green-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-2 px-4">User</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Role</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {localUsers.map(user => (
                  <tr key={user.id || user._id} className="border-t hover:bg-green-50 transition group">
                    {/* Avatar and Name */}
                    <td className="py-2 px-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg shadow">
                        {user.name?.[0]?.toUpperCase() || <FaUser />}
                      </div>
                      <span className="font-semibold text-gray-800">{user.name}</span>
                    </td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">
                      {roleEdit[user.id || user._id] !== undefined ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={roleEdit[user.id || user._id]}
                            onChange={e => handleRoleChange(user.id || user._id, e.target.value)}
                            className="border rounded px-2 py-1"
                          >
                            <option value="admin">Admin</option>
                            <option value="intern">Intern</option>
                            <option value="user">User</option>
                          </select>
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                            onClick={() => handleRoleUpdate(user.id || user._id)}
                            disabled={roleLoading === (user.id || user._id)}
                            title="Save Role"
                          >
                            {roleLoading === (user.id || user._id) ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-2 py-1 rounded"
                            onClick={() => setRoleEdit({ ...roleEdit, [user.id || user._id]: undefined })}
                            title="Cancel"
                          >Cancel</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getRoleBadge(user.role)}`}>{user.role}</span>
                          <button
                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                            onClick={() => handleRoleChange(user.id || user._id, user.role)}
                            title="Edit Role"
                          >
                            <FaUserEdit />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4 flex gap-2">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1 disabled:opacity-50"
                        onClick={() => setConfirmDelete(user.id || user._id)}
                        disabled={deleteLoading === (user.id || user._id)}
                        title="Delete User"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Delete Confirmation Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
            <FaTrash className="text-red-500 text-3xl mb-2" />
            <div className="font-bold text-lg mb-2">Delete User?</div>
            <div className="text-gray-600 mb-4 text-center">Are you sure you want to delete this user? This action cannot be undone.</div>
            <div className="flex gap-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold"
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleteLoading === confirmDelete}
              >
                {deleteLoading === confirmDelete ? 'Deleting...' : 'Delete'}
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded font-semibold"
                onClick={() => setConfirmDelete(null)}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 