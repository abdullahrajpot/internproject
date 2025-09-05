import React, { useState } from 'react';
import './DeleteAccount.css';

const DeleteAccount = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleDeleteRequest = () => {
    setShowConfirmation(true);
    setMessage({ type: '', text: '' });
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setPassword('');
    setMessage({ type: '', text: '' });
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setMessage({ type: 'error', text: 'Please enter your password to confirm' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/intern-profile/delete-account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          confirmPassword: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Account deleted successfully. Redirecting...' });
        
        // Clear local storage and redirect after a short delay
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to delete account' });
      }
    } catch (error) {
      console.error('Delete account error:', error);
      setMessage({ type: 'error', text: 'An error occurred while deleting account' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delete-account">
      <div className="delete-account-header">
        <h2>Delete Account</h2>
        <p>Permanently remove your account and all associated data</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {!showConfirmation ? (
        <div className="delete-account-info">
          <div className="warning-section">
            <div className="warning-icon">⚠️</div>
            <div className="warning-content">
              <h3>This action cannot be undone</h3>
              <p>
                Deleting your account will permanently remove all your data including:
              </p>
              <ul>
                <li>Profile information and settings</li>
                <li>Course progress and achievements</li>
                <li>Messages and communications</li>
                <li>All uploaded files and documents</li>
              </ul>
            </div>
          </div>

          <div className="alternatives-section">
            <h3>Consider these alternatives:</h3>
            <div className="alternatives-list">
              <div className="alternative-item">
                <span className="alternative-icon">👤</span>
                <div>
                  <h4>Update Privacy Settings</h4>
                  <p>Control what information is visible to others</p>
                </div>
              </div>
              <div className="alternative-item">
                <span className="alternative-icon">📧</span>
                <div>
                  <h4>Manage Notifications</h4>
                  <p>Turn off email and push notifications</p>
                </div>
              </div>
              <div className="alternative-item">
                <span className="alternative-icon">⏸️</span>
                <div>
                  <h4>Take a Break</h4>
                  <p>Simply log out and return when you're ready</p>
                </div>
              </div>
            </div>
          </div>

          <div className="delete-actions">
            <button 
              className="delete-button"
              onClick={handleDeleteRequest}
            >
              I understand, delete my account
            </button>
          </div>
        </div>
      ) : (
        <div className="confirmation-section">
          <div className="confirmation-header">
            <h3>Confirm Account Deletion</h3>
            <p>Please enter your password to confirm this action</p>
          </div>

          <form onSubmit={handleConfirmDelete} className="confirmation-form">
            <div className="form-group">
              <label htmlFor="confirmPassword">Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your current password"
                required
                disabled={loading}
              />
            </div>

            <div className="final-warning">
              <div className="final-warning-icon">🚨</div>
              <p>
                <strong>Final Warning:</strong> This will permanently delete your account 
                and all associated data. This action cannot be reversed.
              </p>
            </div>

            <div className="confirmation-actions">
              <button 
                type="button"
                className="cancel-button"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="confirm-delete-button"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete My Account'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="support-section">
        <h3>Need Help?</h3>
        <p>
          If you're having issues with your account, our support team is here to help. 
          Contact us before deleting your account.
        </p>
        <button className="support-button">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default DeleteAccount;