import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';
import { 
  FaHome, 
  FaTasks, 
  FaChartBar, 
  FaCalendarAlt, 
  FaFileAlt, 
  FaCog, 
  FaQuestionCircle,
  FaSignOutAlt,
  FaGraduationCap
} from 'react-icons/fa';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const menuItems = [
    { 
      path: '/interndashboard', 
      label: 'Dashboard', 
      icon: <FaHome size={18} />,
      isActive: pathname === '/interndashboard'
    },
    { 
      path: '/interndashboard/tasks', 
      label: 'My Tasks', 
      icon: <FaTasks size={18} />,
      isActive: pathname === '/interndashboard/tasks'
    },
    { 
      path: '/interndashboard/Reports', 
      label: 'Reporting', 
      icon: <FaChartBar size={18} />,
      isActive: pathname === '/interndashboard/Reports'
    },
    { 
      path: '/interndashboard/calendar', 
      label: 'Calendar', 
      icon: <FaCalendarAlt size={18} />,
      isActive: pathname === '/interndashboard/calendar'
    },
    ...(user?.role === 'intern' ? [{
      path: '/interndashboard/lms', 
      label: 'LMS', 
      icon: <FaGraduationCap size={18} />,
      isActive: pathname === '/interndashboard/lms'
    }] : []),
    { 
      path: '/interndashboard/documents', 
      label: 'Documents', 
      icon: <FaFileAlt size={18} />,
      isActive: pathname === '/interndashboard/documents'
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900 text-white w-72 min-h-screen flex flex-col shadow-2xl">
      {/* Header Section */}
      <div className="p-6 border-b border-slate-700/50">
        {/* User Profile */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-semibold text-sm">
                {getInitials(user?.name)}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-800 rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-lg truncate">
              Welcome {user?.name?.split(' ')[0] || 'User'}!
            </p>
            <p className="text-slate-300 text-sm capitalize">
              {user?.role || 'Intern'} • {user?.department || 'Development'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`group flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out ${
                item.isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:transform hover:scale-102'
              }`}
            >
              <div className={`transition-colors duration-200 ${
                item.isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
              }`}>
                {item.icon}
              </div>
              <span className="font-medium text-sm">
                {item.label}
              </span>
              {item.isActive && (
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-slate-700/50"></div>

        {/* Bottom Menu Items */}
        <div className="space-y-2">
          <Link
            to="/interndashboard/settings"
            className={`group flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out ${
              pathname === '/interndashboard/settings'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <FaCog size={18} className="text-slate-400 group-hover:text-white" />
            <span className="font-medium text-sm">Settings</span>
          </Link>

          <Link
            to="/interndashboard/support"
            className={`group flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out ${
              pathname === '/interndashboard/support'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <FaQuestionCircle size={18} className="text-slate-400 group-hover:text-white" />
            <span className="font-medium text-sm">Support</span>
          </Link>
        </div>
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={handleLogout}
          className="group flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out text-slate-300 hover:text-red-400 hover:bg-red-500/10 w-full"
        >
          <FaSignOutAlt size={18} className="text-slate-400 group-hover:text-red-400" />
          <span className="font-medium text-sm">Logout</span>
        </button>

        {/* Footer Info */}
        <div className="mt-4 pt-4 border-t border-slate-700/30">
          <p className="text-slate-500 text-xs text-center">
            Intern Management v2.0
          </p>
        </div>
      </div>
    </aside>
  );
}