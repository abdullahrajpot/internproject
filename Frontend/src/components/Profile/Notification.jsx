import React, { useState } from 'react';
import './Notification.css';

const Notification = () => {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    profileUpdates: true,
    courseReminders: true,
    achievementAlerts: true,
    mentorMessages: true,
    systemUpdates: false
  });

  const handleToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const notificationSettings = [
    {
      key: 'emailNotifications',
      title: 'Email Notifications',
      description: 'Receive notifications via email'
    },
    {
      key: 'pushNotifications',
      title: 'Push Notifications',
      description: 'Receive browser push notifications'
    },
    {
      key: 'smsNotifications',
      title: 'SMS Notifications',
      description: 'Receive notifications via SMS'
    },
    {
      key: 'profileUpdates',
      title: 'Profile Updates',
      description: 'Get notified about profile changes'
    },
    {
      key: 'courseReminders',
      title: 'Course Reminders',
      description: 'Reminders about upcoming courses'
    },
    {
      key: 'achievementAlerts',
      title: 'Achievement Alerts',
      description: 'Notifications for new achievements'
    },
    {
      key: 'mentorMessages',
      title: 'Mentor Messages',
      description: 'Messages from your mentor'
    },
    {
      key: 'systemUpdates',
      title: 'System Updates',
      description: 'Platform updates and maintenance notices'
    }
  ];

  return (
    <div className="notification-settings">
      <div className="notification-header">
        <h2>Notification Settings</h2>
        <p>Manage how you receive notifications</p>
      </div>

      <div className="notification-list">
        {notificationSettings.map((setting) => (
          <div key={setting.key} className="notification-item">
            <div className="notification-info">
              <h3>{setting.title}</h3>
              <p>{setting.description}</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications[setting.key]}
                onChange={() => handleToggle(setting.key)}
              />
              <span className="slider"></span>
            </label>
          </div>
        ))}
      </div>

      <div className="notification-actions">
        <button className="save-button">
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default Notification;