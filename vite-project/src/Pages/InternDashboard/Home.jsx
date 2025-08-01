import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Contexts/AuthContext';
import { FaTasks, FaCheckCircle, FaSpinner, FaClock, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id || user?._id) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/task/assigned?internId=${user.id || user._id}`)
        .then(res => setTasks(res.data))
        .catch(() => setTasks([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  // Helper to determine display status
  const now = new Date();
  const displayStatus = (task) => {
    if (task.status === 'Ongoing' && task.deadline && new Date(task.deadline) < now) {
      return 'Pending';
    }
    return task.status;
  };

  // Calculate stats
  const total = tasks.length;
  const completed = tasks.filter(t => displayStatus(t) === 'Completed').length;
  const ongoing = tasks.filter(t => displayStatus(t) === 'Ongoing').length;
  const pending = tasks.filter(t => displayStatus(t) === 'Pending').length;

  // Pie chart data
  const COLORS = ['#22c55e', '#3b82f6', '#f59e42']; // green, blue, orange
  const statusData = [
    { name: 'Ongoing', value: ongoing },
    { name: 'Completed', value: completed },
    { name: 'Pending', value: pending },
  ];

  // Mark task as completed
  const markCompleted = async (taskId) => {
    setUpdating(taskId);
    try {
      await axios.patch(`http://localhost:5000/api/task/update-status/${taskId}`, { status: 'Completed' });
      setTasks(tasks => tasks.map(t => (t._id === taskId ? { ...t, status: 'Completed' } : t)));
    } catch {
      alert('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="bg-[#f6f8fa] min-h-screen p-6 md:p-10 font-[Inter,sans-serif]">
      {/* Back to Home Button */}
      <button
        onClick={() => navigate('/')}
        className="mb-6 flex items-center gap-2 bg-white border border-gray-200 shadow px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-semibold"
      >
        <FaArrowLeft /> Back to Home
      </button>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-[#22c55e] to-[#3b82f6] rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
            <FaTasks className="text-white text-4xl" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold mb-1 text-gray-900 tracking-tight">Welcome, {user?.name}</h1>
            <p className="text-gray-500 text-lg">Your personalized intern dashboard</p>
          </div>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        <div className="rounded-2xl p-6 shadow bg-white flex flex-col items-center gap-2 border-t-4 border-[#22c55e]">
          <div className="bg-[#22c55e] rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <FaTasks className="text-white text-2xl" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900">{total}</div>
          <div className="text-md text-gray-500">Assigned Tasks</div>
        </div>
        <div className="rounded-2xl p-6 shadow bg-white flex flex-col items-center gap-2 border-t-4 border-[#3b82f6]">
          <div className="bg-[#3b82f6] rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <FaCheckCircle className="text-white text-2xl" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900">{completed}</div>
          <div className="text-md text-gray-500">Completed</div>
        </div>
        <div className="rounded-2xl p-6 shadow bg-white flex flex-col items-center gap-2 border-t-4 border-[#f59e42]">
          <div className="bg-[#f59e42] rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <FaSpinner className="text-white text-2xl" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900">{ongoing}</div>
          <div className="text-md text-gray-500">Ongoing</div>
        </div>
        <div className="rounded-2xl p-6 shadow bg-white flex flex-col items-center gap-2 border-t-4 border-[#ef4444]">
          <div className="bg-[#ef4444] rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <FaClock className="text-white text-2xl" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900">{pending}</div>
          <div className="text-md text-gray-500">Pending</div>
        </div>
      </div>
      {/* Pie Chart for Task Status */}
      <div className="bg-white rounded-2xl shadow p-8 mb-10 flex flex-col items-center max-w-md mx-auto border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-gray-800 tracking-tight">Task Status Distribution</h2>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              fill="#22c55e"
              stroke="none"
              label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                return (
                  <text
                    x={x}
                    y={y}
                    fill="#fff"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontWeight="bold"
                  >
                    {value}
                  </text>
                );
              }}
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: '#fff', color: '#222', border: 'none' }} />
            <Legend wrapperStyle={{ color: '#222' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Task List */}
      <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 tracking-tight">Your Tasks</h2>
        {loading ? (
          <div className="text-gray-400">Loading tasks...</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="pb-2 text-gray-700">Task</th>
                <th className="pb-2 text-gray-700">Due Date</th>
                <th className="pb-2 text-gray-700">Status</th>
                <th className="pb-2 text-gray-700">File</th>
                <th className="pb-2 text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50 transition">
                  <td className="py-2 text-gray-900 font-medium">{task.title}</td>
                  <td className="py-2 text-gray-900">{task.deadline}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      displayStatus(task) === 'Completed' ? 'bg-green-100 text-green-700' :
                      displayStatus(task) === 'Ongoing' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {displayStatus(task)}
                    </span>
                  </td>
                  <td className="py-2">
                    {task.file ? (
                      <a
                        href={`http://localhost:5000/${task.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                        download
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-2">
                    {displayStatus(task) !== 'Completed' && (
                      <button
                        className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-3 py-1 rounded disabled:opacity-50 font-semibold shadow"
                        onClick={() => markCompleted(task._id)}
                        disabled={updating === task._id}
                      >
                        {updating === task._id ? 'Updating...' : 'Mark Completed'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 