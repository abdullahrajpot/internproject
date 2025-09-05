import React, { useState, useEffect } from 'react';
import './Privacy.css';

const Privacy = ({ profileData, updateProfile }) => {
  const [privacySettings, setPrivacySettings] = useState({
    profile: true,
    contact: false,
    education: true,
    experience: true
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (profileData?.visibility) {
      setPrivacySettings(profileData.visibility);
    }
  }, [profileData]);

  const handleToggle = (key) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await updateProfile({
        ...profileData,
        visibility: privacySettings
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'Privacy settings updated successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update privacy settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating privacy settings' });
    } finally {
      setLoading(false);
    }
  };

  const privacyOptions = [
    {
      key: 'profile',
      title: 'Profile Visibility',
      description: 'Allow others to view your basic profile information'
    },
    {
      key: 'contact',
      title: 'Contact Information',
      description: 'Show your contact details to mentors and admins'
    },
    {
      key: 'education',
      title: 'Education Details',
      description: 'Display your educational background and achievements'
    },
    {
      key: 'experience',
      title: 'Experience & Projects',
      description: 'Show your work experience and project portfolio'
    }
  ];

  return (
    <div className="privacy-settings">
      <div className="privacy-header">
        <h2>Privacy Settings</h2>
        <p>Control what information is visible to others</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="privacy-list">
        {privacyOptions.map((option) => (
          <div key={option.key} className="privacy-item">
            <div className="privacy-info">
              <h3>{option.title}</h3>
              <p>{option.description}</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={privacySettings[option.key]}
                onChange={() => handleToggle(option.key)}
              />
              <span className="slider"></span>
            </label>
          </div>
        ))}
      </div>

      <div className="privacy-notice">
        <div className="notice-icon">🔒</div>
        <div className="notice-content">
          <h4>Privacy Notice</h4>
          <p>
            Your personal information is always secure. These settings only control 
            what information is visible to other users within the platform. 
            Administrators and mentors may have access to additional information 
            as needed for the internship program.
          </p>
        </div>
      </div>

      <div className="privacy-actions">
        <button 
          className="save-button"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Privacy Settings'}
        </button>
      </div>
    </div>
  );
};

export default Privacy;