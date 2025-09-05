import React from 'react';
import './ProfileAvatar.css';

const ProfileAvatar = ({ 
  profileData, 
  size = 'medium', 
  className = '', 
  showStatus = false,
  onClick = null 
}) => {
  const getProfilePicture = () => {
    if (profileData?.profilePicture) {
      return `http://localhost:5000${profileData.profilePicture}`;
    }
    return '/default-avatar.png';
  };

  const getInitials = () => {
    if (profileData?.fullName) {
      return profileData.fullName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'U';
  };

  const sizeClasses = {
    small: 'profile-avatar-small',
    medium: 'profile-avatar-medium', 
    large: 'profile-avatar-large',
    xlarge: 'profile-avatar-xlarge'
  };

  return (
    <div 
      className={`profile-avatar-container ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <img
        src={getProfilePicture()}
        alt="Profile"
        className="profile-avatar-image"
        onError={(e) => {
          // If image fails to load, show initials instead
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div className="profile-avatar-fallback" style={{ display: 'none' }}>
        {getInitials()}
      </div>
      {showStatus && (
        <div className="profile-status-indicator">
          <span className="status-badge">VIP</span>
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;