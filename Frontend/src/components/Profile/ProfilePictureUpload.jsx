import React, { useState, useRef } from 'react';
import './ProfilePictureUpload.css';

const ProfilePictureUpload = ({ profileData, onProfileUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const validateAndUploadFile = async (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 5MB' });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/intern-profile/upload-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
        setPreviewUrl(null);
        if (onProfileUpdate) {
          onProfileUpdate(data.profile);
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to upload profile picture' });
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: 'An error occurred while uploading' });
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await validateAndUploadFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await validateAndUploadFile(files[0]);
    }
  };

  const currentProfilePicture = profileData?.profilePicture 
    ? `http://localhost:5000${profileData.profilePicture}`
    : '/default-avatar.png';

  return (
    <div className="profile-picture-upload">
      <div className="profile-picture-header">
        <h3>Profile Picture</h3>
        <small>Upload a professional photo that represents you</small>
      </div>

      <div 
        className={`profile-picture-container ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="profile-picture-wrapper" onClick={handleFileSelect}>
          <img 
            src={previewUrl || currentProfilePicture} 
            alt="Profile" 
            className="profile-picture"
            onError={(e) => {
              e.target.src = '/default-avatar.png';
            }}
          />
          <div className="upload-overlay">
            <div className="upload-icon">
              {uploading ? (
                <div className="loading-spinner"></div>
              ) : (
                <span>📷</span>
              )}
            </div>
            <span className="upload-text">
              {uploading ? 'Uploading...' : dragOver ? 'Drop image here' : 'Change Photo'}
            </span>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {message.text && (
        <div className={`upload-message ${message.type}`}>
          <div className="message-icon">
            {message.type === 'success' ? '✓' : '!'}
          </div>
          {message.text}
        </div>
      )}

      <div className="upload-info">
        <div className="upload-methods">
          <button 
            className="upload-btn"
            onClick={handleFileSelect}
            disabled={uploading}
          >
            Choose File
          </button>
          <span className="or-text">or drag and drop</span>
        </div>
        <div className="file-requirements">
          <small>
            <strong>Requirements:</strong> JPG, PNG, GIF • Max 5MB • Recommended: 400x400px
          </small>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;