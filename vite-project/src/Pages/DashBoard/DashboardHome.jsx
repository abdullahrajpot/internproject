import React, { useEffect, useState, useMemo } from 'react';
import { useUsers } from '../../Contexts/UserContext';
import { FaUsers, FaUserGraduate, FaTasks, FaPlus, FaUserEdit, FaClipboardList, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';

const COLORS = ['#34d399', '#60a5fa', '#a3a3a3'];

export default function DashboardHome() {
  const navigate = useNavigate();
  const { users, getUsersByRole, loading: usersLoading } = useUsers() || {};
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    setTasksLoading(true);
    axios.get('http://localhost:5000/api/task/assigned')
      .then(res => setTasks(res.data))
      .catch(() => setTasks([]))
      .finally(() => setTasksLoading(false));
  }, []);

  // User role distribution for chart
  const roleData = useMemo(() => {
    if (!users) return [];
    const admin = users.filter(u => u.role === 'admin').length;
    const intern = users.filter(u => u.role === 'intern').length;
    const user = users.filter(u => u.role === 'user').length;
    return [
      { name: 'Admin', value: admin },
      { name: 'Intern', value: intern },
      { name: 'User', value: user },
    ];
  }, [users]);

  // Recent activity: last 5 users and last 5 tasks
  useEffect(() => {
    if (!users || !tasks) return;
    const recentUsers = [...users].reverse().slice(0, 5).map(u => ({
      type: 'user',
      text: `${u.name} joined as ${u.role}`,
      date: u.dateCreated || u.createdAt || '',
    }));
    const recentTasks = [...tasks].reverse().slice(0, 5).map(t => ({
      type: 'task',
      text: `Task '${t.title}' assigned to ${t.intern?.name || t.internName || 'Unknown'}`,
      date: t.assignedDate || t.createdAt || '',
    }));
    setRecentActivity([...recentUsers, ...recentTasks].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7));
  }, [users, tasks]);

  const totalUsers = users ? users.length : '--';
  const totalInternees = getUsersByRole ? getUsersByRole('intern').length : '--';
  const totalTasks = tasks ? tasks.length : '--';
  const recentTasks = tasks ? [...tasks].reverse().slice(0, 5) : [];

  return (
    <div className="max-w-6xl mx-auto mt-10">
      {/* Back to Home Button */}
      <button
        onClick={() => navigate('/')}
        className="mb-6 flex items-center gap-2 bg-white border border-gray-200 shadow px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-semibold"
      >
        <FaArrowLeft /> Back to Home
      </button>
      {/* Header Section */}
      <div className="rounded-2xl bg-gradient-to-r from-green-400 to-blue-400 p-8 mb-8 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard Overview</h1>
          <p className="text-white/80">Quick stats and summary of your platform</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Link to="/dashboard/users" className="bg-white/90 hover:bg-white text-green-600 font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow transition"><FaUsers /> Users</Link>
          <Link to="/dashboard/internees" className="bg-white/90 hover:bg-white text-blue-600 font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow transition"><FaUserGraduate /> Internees</Link>
          <Link to="/dashboard/assign-task" className="bg-white/90 hover:bg-white text-orange-600 font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow transition"><FaPlus /> Assign Task</Link>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Users Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-green-400">
          <FaUsers className="text-4xl text-green-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900 mb-1">{usersLoading ? <span className='animate-pulse'>...</span> : totalUsers}</div>
          <div className="text-gray-600 font-semibold">Total Users</div>
        </div>
        {/* Internees Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-blue-400">
          <FaUserGraduate className="text-4xl text-blue-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900 mb-1">{usersLoading ? <span className='animate-pulse'>...</span> : totalInternees}</div>
          <div className="text-gray-600 font-semibold">Total Internees</div>
        </div>
        {/* Tasks Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-orange-400">
          <FaTasks className="text-4xl text-orange-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900 mb-1">{tasksLoading ? <span className='animate-pulse'>...</span> : totalTasks}</div>
          <div className="text-gray-600 font-semibold">Total Tasks</div>
        </div>
      </div>
      {/* Chart & Recent Activity Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* User Roles Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
          <h2 className="text-lg font-bold mb-4 text-gray-800">User Roles Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={roleData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                fill="#8884d8"
                label
              >
                {roleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Recent Activity Feed */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Recent Activity</h2>
          <ul className="divide-y divide-gray-100">
            {recentActivity.length === 0 && <li className="text-gray-400 italic">No recent activity.</li>}
            {recentActivity.map((item, idx) => (
              <li key={idx} className="py-3 flex items-center gap-3">
                {item.type === 'user' ? <FaUserEdit className="text-blue-400" /> : <FaClipboardList className="text-orange-400" />}
                <span className="text-gray-700">{item.text}</span>
                <span className="ml-auto text-xs text-gray-400">{item.date ? new Date(item.date).toLocaleDateString() : ''}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Recent Tasks Table */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <FaTasks className="text-blue-600 text-2xl" />
          <h2 className="text-xl font-bold text-gray-900">Recent Tasks</h2>
        </div>
        {tasksLoading ? (
          <div className="text-gray-500">Loading tasks...</div>
        ) : recentTasks.length === 0 ? (
          <div className="text-gray-400 italic">No tasks assigned yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-lg font-bold">
                  <th className="py-3 px-6 text-left">Title</th>
                  <th className="py-3 px-6 text-left">Deadline</th>
                  <th className="py-3 px-6 text-left">Assigned Date</th>
                  <th className="py-3 px-6 text-left">Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((task, idx) => (
                  <tr key={task.id || task._id} className={
                    `border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50 transition`
                  }>
                    <td className="py-3 px-6 text-left">{task.title}</td>
                    <td className="py-3 px-6 text-left">{task.deadline ? new Date(task.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}</td>
                    <td className="py-3 px-6 text-left">{task.assignedDate ? new Date(task.assignedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}</td>
                    <td className="py-3 px-6 text-left">{task.assignedTo?.name || '-'}</td>
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