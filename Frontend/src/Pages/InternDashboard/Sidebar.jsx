import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import ProfileAvatar from '../../components/common/ProfileAvatar';
import {
  FaHome,
  FaTasks,
  FaChartBar,
  FaCalendarAlt,
  FaFileAlt,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaGraduationCap,
  FaUser,
  FaEnvelope
} from 'react-icons/fa';

export default function Sidebar({ isOpen, isCollapsed, isMobile, onClose }) {
  const { user, logout } = useAuth();
  const { profileData } = useProfile();
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
      path: '/interndashboard/calender',
      label: 'Calendar',
      icon: <FaCalendarAlt size={18} />,
      isActive: pathname === '/interndashboard/calender'
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
    },
    {
      path: '/interndashboard/Profile',
      label: 'Profile',
      icon: <FaUser size={18} />,
      isActive: pathname === '/interndashboard/Profile'
    },
    {
      path: '/interndashboard/messages',
      label: 'Messages',
      icon: <FaEnvelope size={18} />,
      isActive: pathname === '/interndashboard/messages'
    }
  ];

  const handleLogout = () => {
    logout();
  };

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={`dashboard-sidebar bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900 text-white flex flex-col shadow-2xl transition-all duration-300 ease-in-out z-50 ${isMobile
        ? `fixed top-0 left-0 h-full ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
        : 'fixed top-0 left-0 h-full'
        }`}
      style={{
        width: isMobile ? '280px' : (isCollapsed ? '80px' : '280px'),
        minWidth: isMobile ? '280px' : (isCollapsed ? '80px' : '280px')
      }}
    >
      {/* Header Section */}
      <div className={`${isCollapsed && !isMobile ? 'p-4' : 'p-5'} border-b border-slate-700/50 transition-all duration-300`}>
        {/* Mobile close button */}
        {isMobile && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors duration-200"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* User Profile */}
        <Link
          to="/interndashboard/Profile"
          onClick={handleLinkClick}
          className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3'
            } mb-5 p-3 rounded-xl transition-all duration-200 ease-in-out group ${pathname === '/interndashboard/Profile'
              ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30'
              : 'hover:bg-slate-700/30'
            }`}
          title={isCollapsed && !isMobile ? `${profileData?.fullName?.split(' ')[0] || user?.name?.split(' ')[0] || 'User'} - Profile` : ''}
        >
          <div className="relative flex-shrink-0">
            {user?.role === 'intern' && profileData ? (
              <div className="w-10 h-10">
                <ProfileAvatar
                  profileData={profileData}
                  size="medium"
                  className="sidebar-profile-avatar"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-600 group-hover:border-slate-500 transition-colors duration-200">
                <span className="text-white font-semibold text-xs">
                  {getInitials(user?.name)}
                </span>
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full"></div>
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="flex items-center gap-2">
                <p className="text-white font-semibold text-base truncate group-hover:text-blue-300 transition-colors duration-200">
                  Welcome {profileData?.fullName?.split(' ')[0] || user?.name?.split(' ')[0] || 'User'}!
                </p>
                {pathname === '/interndashboard/Profile' && (
                  <FaUser className="text-blue-400 text-sm flex-shrink-0" />
                )}
              </div>
              <p className="text-slate-300 text-sm capitalize group-hover:text-slate-200 transition-colors duration-200 truncate">
                {user?.role || 'Intern'} • {user?.department || 'Development'}
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className={`flex-1 ${isCollapsed && !isMobile ? 'px-3' : 'px-4'} py-5 transition-all duration-300 overflow-y-auto`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#475569 #1e293b'
        }}
      >
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={handleLinkClick}
              className={`group flex items-center relative ${isCollapsed && !isMobile ? 'justify-center px-3' : 'space-x-3 px-4'
                } py-3.5 rounded-lg transition-all duration-200 ease-in-out ${item.isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:transform hover:scale-[1.01]'
                }`}
              title={isCollapsed && !isMobile ? item.label : ''}
            >
              <div className={`transition-all duration-200 flex-shrink-0 ${item.isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                }`}>
                {item.icon}
              </div>
              {(!isCollapsed || isMobile) && (
                <>
                  <span className="font-medium text-sm flex-1 min-w-0 overflow-hidden">
                    {item.label}
                  </span>
                  {item.isActive && (
                    <div className="ml-auto flex-shrink-0">
                      <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                    </div>
                  )}
                </>
              )}
              {isCollapsed && !isMobile && item.isActive && (
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full opacity-80"></div>
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-slate-700/50"></div>

        {/* Bottom Menu Items */}
        <div className="space-y-2">
          <Link
            to="/interndashboard/settings"
            onClick={handleLinkClick}
            className={`group flex items-center ${isCollapsed && !isMobile ? 'justify-center px-3' : 'space-x-3 px-4'
              } py-3.5 rounded-lg transition-all duration-200 ease-in-out ${pathname === '/interndashboard/settings'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            title={isCollapsed && !isMobile ? 'Settings' : ''}
          >
            <FaCog size={18} className={`transition-colors duration-200 flex-shrink-0 ${pathname === '/interndashboard/settings' ? 'text-white' : 'text-slate-400 group-hover:text-white'
              }`} />
            {(!isCollapsed || isMobile) && (
              <span className="font-medium text-sm">Settings</span>
            )}
          </Link>

          <Link
            to="/interndashboard/support"
            onClick={handleLinkClick}
            className={`group flex items-center ${isCollapsed && !isMobile ? 'justify-center px-3' : 'space-x-3 px-4'
              } py-3.5 rounded-lg transition-all duration-200 ease-in-out ${pathname === '/interndashboard/support'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            title={isCollapsed && !isMobile ? 'Support' : ''}
          >
            <FaQuestionCircle size={18} className={`transition-colors duration-200 flex-shrink-0 ${pathname === '/interndashboard/support' ? 'text-white' : 'text-slate-400 group-hover:text-white'
              }`} />
            {(!isCollapsed || isMobile) && (
              <span className="font-medium text-sm">Support</span>
            )}
          </Link>
        </div>
      </nav>

      {/* Logout Section */}
      <div className={`${isCollapsed && !isMobile ? 'p-3' : 'p-4'} border-t border-slate-700/50 transition-all duration-300`}>
        <button
          onClick={handleLogout}
          className={`group flex items-center ${isCollapsed && !isMobile ? 'justify-center px-3' : 'space-x-3 px-4'
            } py-3.5 rounded-lg transition-all duration-200 ease-in-out text-slate-300 hover:text-red-400 hover:bg-red-500/10 w-full`}
          title={isCollapsed && !isMobile ? 'Logout' : ''}
        >
          <FaSignOutAlt size={18} className="text-slate-400 group-hover:text-red-400 transition-colors duration-200 flex-shrink-0" />
          {(!isCollapsed || isMobile) && (
            <span className="font-medium text-sm">Logout</span>
          )}
        </button>

        {/* Footer Info */}
        {(!isCollapsed || isMobile) && (
          <div className="mt-4 pt-4 border-t border-slate-700/30">
            <p className="text-slate-500 text-xs text-center">
              Intern Management v2.0
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}