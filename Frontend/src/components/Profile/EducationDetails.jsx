import React, { useState, useEffect } from 'react';
import './EducationDetails.css';

const EducationDetails = ({ profileData, updateProfile, onDataChange }) => {
  const [formData, setFormData] = useState({
    education: {
      currentLevel: '',
      institution: '',
      major: '',
      graduationYear: '',
      cgpa: '',
      skills: []
    }
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newSkill, setNewSkill] = useState('');
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [skillSuggestions] = useState([
    'JavaScript', 'Python', 'React', 'Node.js', 'HTML/CSS', 'Java', 'C++', 'SQL',
    'Project Management', 'Communication', 'Leadership', 'Problem Solving',
    'Data Analysis', 'Machine Learning', 'UI/UX Design', 'Digital Marketing'
  ]);

  useEffect(() => {
    if (profileData?.education) {
      setFormData({
        education: {
          currentLevel: profileData.education.currentLevel || '',
          institution: profileData.education.institution || '',
          major: profileData.education.major || '',
          graduationYear: profileData.education.graduationYear || '',
          cgpa: profileData.education.cgpa || '',
          skills: profileData.education.skills || []
        }
      });
    }
  }, [profileData]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'institution':
        if (value && value.trim().length < 2) {
          newErrors.institution = 'Institution name must be at least 2 characters';
        } else {
          delete newErrors.institution;
        }
        break;
      case 'major':
        if (value && value.trim().length < 2) {
          newErrors.major = 'Major must be at least 2 characters';
        } else {
          delete newErrors.major;
        }
        break;
      case 'graduationYear':
        const currentYear = new Date().getFullYear();
        const year = parseInt(value);
        if (value && (year < 1950 || year > currentYear + 10)) {
          newErrors.graduationYear = `Year must be between 1950 and ${currentYear + 10}`;
        } else {
          delete newErrors.graduationYear;
        }
        break;
      case 'cgpa':
        const gpa = parseFloat(value);
        if (value && (gpa < 0 || gpa > 4)) {
          newErrors.cgpa = 'CGPA must be between 0.00 and 4.00';
        } else {
          delete newErrors.cgpa;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate field
    validateField(name, value);
    
    setFormData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        [name]: value
      }
    }));
    
    setHasChanges(true);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.education.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        education: {
          ...prev.education,
          skills: [...prev.education.skills, newSkill.trim()]
        }
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        skills: prev.education.skills.filter(skill => skill !== skillToRemove)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const fieldsToValidate = [
      { field: 'institution', value: formData.education.institution },
      { field: 'major', value: formData.education.major },
      { field: 'graduationYear', value: formData.education.graduationYear },
      { field: 'cgpa', value: formData.education.cgpa }
    ];
    
    fieldsToValidate.forEach(({ field, value }) => {
      validateField(field, value);
    });

    // Check if there are any validation errors
    if (Object.keys(errors).length > 0) {
      setMessage({ type: 'error', text: 'Please fix the errors before saving' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await updateProfile({
        ...profileData,
        education: formData.education
      });
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Education details updated successfully!' });
        setIsEditing(false);
        setHasChanges(false);
        if (onDataChange) {
          onDataChange(prev => ({ ...prev, education: formData.education }));
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update education details' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating education details' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (profileData?.education) {
      setFormData({
        education: {
          currentLevel: profileData.education.currentLevel || '',
          institution: profileData.education.institution || '',
          major: profileData.education.major || '',
          graduationYear: profileData.education.graduationYear || '',
          cgpa: profileData.education.cgpa || '',
          skills: profileData.education.skills || []
        }
      });
    }
    setIsEditing(false);
    setHasChanges(false);
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  const calculateCompletionPercentage = () => {
    const fields = [
      formData.education.currentLevel,
      formData.education.institution,
      formData.education.major,
      formData.education.graduationYear,
      formData.education.cgpa,
      formData.education.skills.length > 0 ? 'skills' : ''
    ];
    
    const filledFields = fields.filter(field => field && field.toString().trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isEditing) {
        // Ctrl/Cmd + S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
          e.preventDefault();
          if (Object.keys(errors).length === 0) {
            handleSubmit(e);
          }
        }
        // Escape to cancel
        if (e.key === 'Escape') {
          e.preventDefault();
          if (hasChanges) {
            if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
              handleCancel();
            }
          } else {
            handleCancel();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, hasChanges, errors]);

  return (
    <div className="education-details">
      <div className="education-details-header">
        <div className="header-left">
          <h2>Education Details</h2>
          <div className="profile-completion">
            <div className="completion-bar">
              <div 
                className="completion-fill" 
                style={{ width: `${calculateCompletionPercentage()}%` }}
              ></div>
            </div>
            <span className="completion-text">
              {calculateCompletionPercentage()}% Complete
            </span>
          </div>
        </div>
        {!isEditing ? (
          <button 
            className="edit-button"
            onClick={() => setIsEditing(true)}
          >
            <span className="edit-icon">✏️</span>
            Edit
          </button>
        ) : (
          <div className="edit-actions">
            <button 
              className="cancel-button"
              onClick={() => {
                if (hasChanges) {
                  if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                    handleCancel();
                  }
                } else {
                  handleCancel();
                }
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="save-button"
              onClick={handleSubmit}
              disabled={loading || Object.keys(errors).length > 0}
            >
              {loading ? (
                <>
                  <span className="loading-spinner-small"></span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        )}
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {isEditing && (
        <div className="keyboard-shortcuts">
          <small>
            💡 <strong>Tip:</strong> Press <kbd>Ctrl+S</kbd> to save or <kbd>Esc</kbd> to cancel
          </small>
        </div>
      )}

      <form onSubmit={handleSubmit} className="education-details-form">
        <div className="form-section">
          <h3>Academic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="currentLevel">Current Education Level</label>
              <select
                id="currentLevel"
                name="currentLevel"
                value={formData.education.currentLevel}
                onChange={handleInputChange}
                disabled={!isEditing}
              >
                <option value="">Select Level</option>
                <option value="high-school">High School</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="graduate">Graduate</option>
                <option value="postgraduate">Postgraduate</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="institution">
                Institution/University
                <span className="tooltip">
                  <span className="tooltip-icon">ℹ️</span>
                  <span className="tooltip-text">
                    Enter the full name of your educational institution
                  </span>
                </span>
              </label>
              <input
                type="text"
                id="institution"
                name="institution"
                value={formData.education.institution}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter your institution name"
                className={errors.institution ? 'error' : ''}
              />
              {errors.institution && (
                <span className="error-message">{errors.institution}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="major">
                Major/Field of Study
                <span className="tooltip">
                  <span className="tooltip-icon">ℹ️</span>
                  <span className="tooltip-text">
                    Your area of specialization or degree program
                  </span>
                </span>
              </label>
              <input
                type="text"
                id="major"
                name="major"
                value={formData.education.major}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="e.g., Computer Science, Business Administration"
                className={errors.major ? 'error' : ''}
              />
              {errors.major && (
                <span className="error-message">{errors.major}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="graduationYear">Graduation Year</label>
              <input
                type="number"
                id="graduationYear"
                name="graduationYear"
                value={formData.education.graduationYear}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="2024"
                min="1950"
                max="2030"
                className={errors.graduationYear ? 'error' : ''}
              />
              {errors.graduationYear && (
                <span className="error-message">{errors.graduationYear}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="cgpa">
                CGPA/GPA
                <span className="tooltip">
                  <span className="tooltip-icon">ℹ️</span>
                  <span className="tooltip-text">
                    Your cumulative grade point average (0.00 - 4.00 scale)
                  </span>
                </span>
              </label>
              <input
                type="number"
                id="cgpa"
                name="cgpa"
                value={formData.education.cgpa}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="3.75"
                step="0.01"
                min="0"
                max="4"
                className={errors.cgpa ? 'error' : ''}
              />
              {errors.cgpa && (
                <span className="error-message">{errors.cgpa}</span>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>
            Skills & Competencies
            <span className="tooltip">
              <span className="tooltip-icon">ℹ️</span>
              <span className="tooltip-text">
                Add technical skills, programming languages, tools, and soft skills relevant to your field
              </span>
            </span>
          </h3>
          
          {isEditing && (
            <div className="skill-input-section">
              <div className="skill-input-group">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill (e.g., JavaScript, Python, Project Management)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                />
                <button 
                  type="button" 
                  className="add-skill-btn"
                  onClick={handleAddSkill}
                  disabled={!newSkill.trim()}
                >
                  Add Skill
                </button>
              </div>
              
              {/* Skill Suggestions */}
              <div className="skill-suggestions">
                <p className="suggestions-label">Popular skills:</p>
                <div className="suggestions-list">
                  {skillSuggestions
                    .filter(skill => 
                      !formData.education.skills.includes(skill) && 
                      skill.toLowerCase().includes(newSkill.toLowerCase())
                    )
                    .slice(0, 8)
                    .map((skill, index) => (
                      <button
                        key={index}
                        type="button"
                        className="suggestion-btn"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            education: {
                              ...prev.education,
                              skills: [...prev.education.skills, skill]
                            }
                          }));
                          setNewSkill('');
                          setHasChanges(true);
                        }}
                      >
                        {skill}
                      </button>
                    ))
                  }
                </div>
              </div>
            </div>
          )}

          <div className="skills-display">
            {formData.education.skills.length > 0 ? (
              <div className="skills-list">
                {formData.education.skills.map((skill, index) => (
                  <div key={index} className="skill-tag">
                    <span>{skill}</span>
                    {isEditing && (
                      <button 
                        type="button"
                        className="remove-skill-btn"
                        onClick={() => handleRemoveSkill(skill)}
                        title="Remove skill"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-skills">
                <p>No skills added yet</p>
                {isEditing && (
                  <small>Start typing to add skills or select from suggestions above</small>
                )}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EducationDetails;