import React from 'react';
import {
  FaUsers,
  FaUserShield,
  FaUserGraduate,
  FaCheckCircle
} from 'react-icons/fa';

const UserStats = ({ users, userStats }) => {
  const totalUsers = users.length;
  const admins = users.filter(u => u.role === 'admin').length;
  const internees = users.filter(u => u.role === 'intern').length;
  const activeUsers = users.filter(u => userStats[u._id || u.id]?.isActive).length;

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: FaUsers,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    {
      title: 'Admins',
      value: admins,
      icon: FaUserShield,
      color: 'red',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-500'
    },
    {
      title: 'Internees',
      value: internees,
      icon: FaUserGraduate,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    {
      title: 'Active Users',
      value: activeUsers,
      icon: FaCheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.title}</div>
              </div>
              <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserStats;