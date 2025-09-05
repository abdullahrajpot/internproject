import React from 'react';
import ProfileAvatar from '../common/ProfileAvatar';
import './ProfileSidebar.css';

const ProfileSidebar = ({ profileData, activeTab, setActiveTab, onClose, isMobile }) => {
  const achievements = profileData?.achievements || [];
  const coursesInProgress = profileData?.internshipDetails?.coursesInProgress || 0;
  const coursesCompleted = profileData?.internshipDetails?.coursesCompleted || 23;

  return (
    <div className="profile-sidebar">
      {isMobile && (
        <div className="sidebar-header">
          <h3>Profile Menu</h3>
          <button 
            className="close-sidebar"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="profile-card">
        <div className="profile-image-container">
          <ProfileAvatar
            profileData={profileData}
            size="xlarge"
            showStatus={true}
          />
        </div>
        
        <h3 className="profile-name">{profileData?.fullName || 'Martin Nel'}</h3>
        
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-number">{String(coursesInProgress).padStart(2, '0')}</span>
            <span className="stat-label">Course in progress</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{String(coursesCompleted).padStart(2, '0')}</span>
            <span className="stat-label">Course Complete</span>
          </div>
        </div>
      </div>

      <div className="achievements-section">
        <h4>Last Achievement</h4>
        <div className="achievements-grid">
          {achievements.length > 0 ? (
            achievements.slice(-4).map((achievement, index) => (
              <div key={index} className="achievement-item">
                <span className="achievement-icon">{achievement.icon || '👑'}</span>
              </div>
            ))
          ) : (
            <>
              <div className="achievement-item">
                <span className="achievement-icon">👑</span>
              </div>
              <div className="achievement-item">
                <span className="achievement-icon">🏆</span>
              </div>
              <div className="achievement-item">
                <span className="achievement-icon">🎯</span>
              </div>
              <div className="achievement-item">
                <span className="achievement-icon">🏅</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="support-section">
        <h4>Support</h4>
        <div className="support-options">
          <div className="support-item">
            <span className="support-icon">👨‍🏫</span>
            <span>Become a Mentor</span>
          </div>
          <div className="support-item">
            <span className="support-icon">💬</span>
            <span>Support</span>
          </div>
          <div 
            className="support-item"
            onClick={() => setActiveTab('invite')}
          >
            <span className="support-icon">👥</span>
            <span>Invite friend</span>
          </div>
          <div 
            className="support-item danger"
            onClick={() => setActiveTab('delete')}
          >
            <span className="support-icon">🗑️</span>
            <span>Delete Account</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;