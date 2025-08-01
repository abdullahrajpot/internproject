import React, { useState, useMemo } from 'react';
import { useUsers } from '../../Contexts/UserContext';
import axios from 'axios';
import { FaTrash, FaUserEdit, FaSearch } from 'react-icons/fa';

export default function Internees() {
  const { users, loading, error, getUsersByRole } = useUsers() || {};
  const [search, setSearch] = useState('');
  const [roleEdit, setRoleEdit] = useState({});
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [roleLoading, setRoleLoading] = useState(null);

  const internees = getUsersByRole ? getUsersByRole('intern') : [];

  const filteredInternees = useMemo(() => {
    if (!search) return internees;
    return internees.filter(u =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
    );
  }, [internees, search]);

  const handleSearch = e => {
    setSearch(e.target.value);
  };

  const handleDelete = async (userId) => {
    setDeleteLoading(userId);
    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${userId}`);
      // No need to update state here, context will update
    } catch {
      alert('Failed to delete intern');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setRoleEdit({ ...roleEdit, [userId]: newRole });
  };

  const handleRoleUpdate = async (userId) => {
    setRoleLoading(userId);
    try {
      await axios.patch(`http://localhost:5000/api/auth/users/${userId}/role`, { role: roleEdit[userId] });
      setRoleEdit({ ...roleEdit, [userId]: undefined });
    } catch {
      alert('Failed to update role');
    } finally {
      setRoleLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Internees <span className="text-green-600">({filteredInternees.length})</span></h1>
        <div className="flex items-center gap-2 bg-gray-100 rounded px-3 py-2">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={handleSearch}
            className="bg-transparent outline-none px-2"
          />
        </div>
      </div>
      {loading ? (
        <div className="text-gray-500">Loading internees...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Role</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInternees.map(user => (
                <tr key={user.id || user._id} className="border-t hover:bg-green-50 transition">
                  <td className="py-2 px-4">{user.name}</td>
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
                        >
                          {roleLoading === (user.id || user._id) ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-2 py-1 rounded"
                          onClick={() => setRoleEdit({ ...roleEdit, [user.id || user._id]: undefined })}
                        >Cancel</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="capitalize">{user.role}</span>
                        <button
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                          onClick={() => handleRoleChange(user.id || user._id, user.role)}
                        >
                          <FaUserEdit />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 disabled:opacity-50"
                      onClick={() => handleDelete(user.id || user._id)}
                      disabled={deleteLoading === (user.id || user._id)}
                    >
                      <FaTrash /> {deleteLoading === (user.id || user._id) ? 'Removing...' : 'Remove'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 