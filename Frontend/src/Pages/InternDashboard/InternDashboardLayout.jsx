import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import NotificationDropdown from '../../components/NotificationDropdown';

export default function InternDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Auto-close sidebar on mobile when resizing
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
      
      // Reset collapsed state when switching to mobile
      if (mobile) {
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && sidebarOpen && !event.target.closest('.dashboard-sidebar')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        isMobile={isMobile}
        onClose={() => setSidebarOpen(false)}
      />
      
      {/* Main content */}
      <main className={`transition-all duration-300 min-h-screen ${
        isMobile 
          ? 'ml-0' 
          : sidebarCollapsed 
            ? 'ml-20' 
            : 'ml-80'
      }`}>
        <div className="p-4 lg:p-8">
          {/* Mobile header with toggle and notifications */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-white shadow-md hover:bg-gray-50 transition-colors duration-200"
              aria-label="Toggle sidebar"
            >
              <div className={`w-6 h-5 flex flex-col justify-between transform transition-all duration-300 ${sidebarOpen ? 'rotate-45' : ''}`}>
                <span className={`block h-0.5 bg-gray-600 transform transition-all duration-300 ${sidebarOpen ? 'rotate-90 translate-y-2' : ''}`}></span>
                <span className={`block h-0.5 bg-gray-600 transition-all duration-300 ${sidebarOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 bg-gray-600 transform transition-all duration-300 ${sidebarOpen ? '-rotate-90 -translate-y-2' : ''}`}></span>
              </div>
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
            <NotificationDropdown />
          </div>

          {/* Desktop header with toggle and notifications */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg bg-white shadow-md hover:bg-gray-50 transition-colors duration-200"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className="block h-0.5 bg-gray-600"></span>
                <span className="block h-0.5 bg-gray-600"></span>
                <span className="block h-0.5 bg-gray-600"></span>
              </div>
            </button>
            <NotificationDropdown />
          </div>
          
          <Outlet />
        </div>
      </main>
    </div>
  );
} 