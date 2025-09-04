import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../Contexts/AuthContext';
import { useUsers } from '../../Contexts/UserContext';
import { FaTasks, FaTrash, FaFileAlt, FaUser, FaCalendarAlt, FaPlus, FaClock } from 'react-icons/fa';

export default function AssignTask() {
  const { user } = useAuth();
  const { users, loading, error: userError, getUsersByRole } = useUsers() || {};
  const internees = getUsersByRole ? getUsersByRole('intern') : [];
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: '',
    assignedDate: new Date().toISOString().slice(0, 10),
    file: null,
    internId: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Fetch previously assigned tasks
  useEffect(() => {
    setTasksLoading(true);
    axios.get('http://localhost:5000/api/task/assigned')
      .then(res => setTasks(res.data))
      .catch(() => setError('Failed to fetch assigned tasks.'))
      .finally(() => setTasksLoading(false));
  }, [success]); // refetch on new assignment

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
    <div className="max-w-5xl mx-auto mt-10">
      {/* Card Layout for Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <FaPlus className="text-green-600 text-2xl" />
          <h1 className="text-2xl font-bold text-gray-900">Assign Task to Intern</h1>
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
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-2 rounded-lg font-semibold shadow hover:from-green-600 hover:to-green-700 transition flex items-center gap-2">
              <FaPlus /> Assign Task
            </button>
          </div>
        </form>
      </div>

      {/* Assigned Tasks Grid */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <FaTasks className="text-blue-600 text-2xl" />
          <h2 className="text-xl font-bold text-gray-900">Previously Assigned Tasks</h2>
        </div>
        {tasksLoading ? (
          <div className="text-gray-500">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-gray-400 italic">No tasks assigned yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-lg font-bold">
                  <th className="py-3 px-6 text-left">Title</th>
                  <th className="py-3 px-6 text-left">Description</th>
                  <th className="py-3 px-6 text-left">Deadline</th>
                  <th className="py-3 px-6 text-left">Assigned Date</th>
                  <th className="py-3 px-6 text-left">Assigned To</th>
                  <th className="py-3 px-6 text-left">File</th>
                  <th className="py-3 px-6 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, idx) => (
                  <tr key={task.id || task._id} className={
                    `border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50 transition`
                  }>
                    <td className="py-3 px-6 text-left">{task.title}</td>
                    <td className="py-1 px-6 text-left line-clamp-2">{task.description}</td>

                    <td className="py-3 px-6 text-left">
                      {task.deadline ? (
                        <div>
                          <div className="font-medium">{new Date(task.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                          <div className="text-sm text-gray-500">{new Date(task.deadline).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-6 text-left">{task.assignedDate ? new Date(task.assignedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}</td>
                    <td className="py-3 px-6 text-left">{task.assignedTo?.name || '-'}</td>
                    <td className="py-3 px-6 text-left">
                      {task.file ? (
                        <a
                          href={`http://localhost:5000/${task.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline flex items-center gap-1">File</a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-left">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 disabled:opacity-50"
                        onClick={() => handleDelete(task.id || task._id)}
                        disabled={deleteLoading === (task.id || task._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 