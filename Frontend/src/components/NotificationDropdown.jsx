import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  FaBell,
  FaEnvelope,
  FaTasks,
  FaExclamationTriangle,
  FaBullhorn,
  FaTimes,
  FaCheck,
  FaTrash,
  FaEye
} from 'react-icons/fa';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // For now, use mock data since the API might not be ready
      const mockNotifications = [
        {
          _id: '1',
          title: 'Welcome to the System',
          message: 'Welcome to your internship dashboard! You can view your tasks, progress, and receive important updates here.',
          type: 'system',
          priority: 'medium',
          isRead: false,
          sender: { name: 'System', email: 'system@company.com' },
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          title: 'Task Assignment',
          message: 'You have been assigned a new task. Please check your tasks section for details.',
          type: 'task_assigned',
          priority: 'high',
          isRead: false,
          sender: { name: 'Admin', email: 'admin@company.com' },
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
        }
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length);

      /* 
      // Real API call - uncomment when backend is ready
      const response = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 10 }
      });

      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.pagination.unreadCount);
      }
      */
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to mock data
      const mockNotifications = [
        {
          _id: '1',
          title: 'Welcome Message',
          message: 'Welcome to your dashboard! This is a sample notification.',
          type: 'message',
          priority: 'medium',
          isRead: false,
          sender: { name: 'Admin', email: 'admin@company.com' },
          createdAt: new Date().toISOString()
        }
      ];
      setNotifications(mockNotifications);
      setUnreadCount(1);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // For now, use mock data
      setUnreadCount(2); // Mock unread count

      /* 
      // Real API call - uncomment when backend is ready
      const response = await axios.get('http://localhost:5000/api/notifications/unread-count', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUnreadCount(response.data.unreadCount);
      }
      */
    } catch (error) {
      console.error('Error fetching unread count:', error);
      setUnreadCount(1); // Fallback
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:5000/api/notifications/mark-all-read', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      const deletedNotification = notifications.find(n => n._id === notificationId);
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Get notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return <FaEnvelope className="text-blue-500" />;
      case 'task_assigned':
        return <FaTasks className="text-green-500" />;
      case 'task_completed':
        return <FaCheck className="text-green-600" />;
      case 'system':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'announcement':
        return <FaBullhorn className="text-purple-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-blue-500 bg-blue-50';
      case 'low':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications on mount and periodically
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            fetchNotifications();
          }
        }}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <FaBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaBell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border-l-4 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? getPriorityColor(notification.priority) : 'border-l-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-500">
                              From: {notification.sender?.name || 'System'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatTime(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Mark as read"
                            >
                              <FaCheck className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedNotification(notification)}
                            className="text-gray-600 hover:text-gray-800"
                            title="View details"
                          >
                            <FaEye className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <FaTrash className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
          onMarkAsRead={markAsRead}
          onDelete={deleteNotification}
        />
      )}
    </div>
  );
};

// Notification Detail Modal
const NotificationDetailModal = ({ notification, onClose, onMarkAsRead, onDelete }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            {notification.type === 'message' && <FaEnvelope className="text-blue-500" />}
            {notification.type === 'task_assigned' && <FaTasks className="text-green-500" />}
            <h2 className="text-lg font-bold text-gray-900">Notification Details</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Subject</h3>
              <p className="text-gray-900 mt-1">{notification.title}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700">Message</h3>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{notification.message}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">From</h3>
                <p className="text-gray-900 mt-1">{notification.sender?.name || 'System'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Priority</h3>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                  notification.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                  notification.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  notification.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {notification.priority?.charAt(0).toUpperCase() + notification.priority?.slice(1)}
                </span>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700">Received</h3>
              <p className="text-gray-900 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            {!notification.isRead && (
              <button
                onClick={() => {
                  onMarkAsRead(notification._id);
                  onClose();
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mark as Read
              </button>
            )}
            <button
              onClick={() => {
                onDelete(notification._id);
                onClose();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;