import React, { useState } from 'react';
import './InviteFriends.css';

const InviteFriends = () => {
  const [emails, setEmails] = useState(['']);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: '', text: '' });

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const removeEmailField = (index) => {
    if (emails.length > 1) {
      const newEmails = emails.filter((_, i) => i !== index);
      setEmails(newEmails);
    }
  };

  const validateEmails = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = emails.filter(email => email.trim() && emailRegex.test(email.trim()));
    return validEmails;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validEmails = validateEmails();
    if (validEmails.length === 0) {
      setNotification({ type: 'error', text: 'Please enter at least one valid email address' });
      return;
    }

    setLoading(true);
    setNotification({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/intern-profile/invite', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emails: validEmails,
          message: message.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({ 
          type: 'success', 
          text: `Invitations sent successfully to ${validEmails.length} recipients!` 
        });
        setEmails(['']);
        setMessage('');
      } else {
        setNotification({ type: 'error', text: data.message || 'Failed to send invitations' });
      }
    } catch (error) {
      console.error('Invite error:', error);
      setNotification({ type: 'error', text: 'An error occurred while sending invitations' });
    } finally {
      setLoading(false);
    }
  };

  const shareableLink = `${window.location.origin}/register`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setNotification({ type: 'success', text: 'Link copied to clipboard!' });
    } catch (error) {
      setNotification({ type: 'error', text: 'Failed to copy link' });
    }
  };

  return (
    <div className="invite-friends">
      <div className="invite-header">
        <h2>Invite Friends</h2>
        <p>Invite your friends to join our internship platform</p>
      </div>

      {notification.text && (
        <div className={`notification ${notification.type}`}>
          {notification.text}
        </div>
      )}

      <div className="invite-methods">
        <div className="invite-section">
          <h3>Send Email Invitations</h3>
          <form onSubmit={handleSubmit} className="invite-form">
            <div className="email-inputs">
              {emails.map((email, index) => (
                <div key={index} className="email-input-group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    placeholder="Enter email address"
                    className="email-input"
                  />
                  {emails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmailField(index)}
                      className="remove-email-btn"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addEmailField}
              className="add-email-btn"
            >
              + Add Another Email
            </button>

            <div className="message-section">
              <label htmlFor="inviteMessage">Personal Message (Optional)</label>
              <textarea
                id="inviteMessage"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal message to your invitation..."
                rows={4}
                maxLength={500}
              />
              <small className="char-count">{message.length}/500 characters</small>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="send-invites-btn"
            >
              {loading ? 'Sending...' : 'Send Invitations'}
            </button>
          </form>
        </div>

        <div className="invite-section">
          <h3>Share Registration Link</h3>
          <div className="share-link-section">
            <div className="link-display">
              <input
                type="text"
                value={shareableLink}
                readOnly
                className="share-link-input"
              />
              <button
                onClick={copyToClipboard}
                className="copy-link-btn"
              >
                📋 Copy
              </button>
            </div>
            <p className="link-description">
              Share this link with your friends so they can register directly
            </p>
          </div>

          <div className="social-share">
            <h4>Share on Social Media</h4>
            <div className="social-buttons">
              <button
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=Join me on this amazing internship platform!&url=${shareableLink}`, '_blank')}
                className="social-btn twitter"
              >
                🐦 Twitter
              </button>
              <button
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareableLink}`, '_blank')}
                className="social-btn facebook"
              >
                📘 Facebook
              </button>
              <button
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareableLink}`, '_blank')}
                className="social-btn linkedin"
              >
                💼 LinkedIn
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="invite-benefits">
        <h3>Why Invite Friends?</h3>
        <div className="benefits-grid">
          <div className="benefit-item">
            <span className="benefit-icon">🤝</span>
            <div>
              <h4>Learn Together</h4>
              <p>Collaborate and learn with your friends</p>
            </div>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🏆</span>
            <div>
              <h4>Earn Rewards</h4>
              <p>Get recognition for successful referrals</p>
            </div>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🌟</span>
            <div>
              <h4>Build Network</h4>
              <p>Expand your professional network</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteFriends;