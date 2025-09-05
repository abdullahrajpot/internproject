import React, { useState, useEffect } from 'react';
import './PersonalDetails.css';

const PersonalDetails = ({ profileData, updateProfile, onDataChange }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        gender: 'prefer-not-to-say',
        phoneNumber: '',
        alternatePhone: '',
        bio: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'Bangladesh'
        }
    });

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [errors, setErrors] = useState({});
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (profileData) {
            setFormData({
                fullName: profileData.fullName || '',
                dateOfBirth: profileData.dateOfBirth ? profileData.dateOfBirth.split('T')[0] : '',
                gender: profileData.gender || 'prefer-not-to-say',
                phoneNumber: profileData.phoneNumber || '',
                alternatePhone: profileData.alternatePhone || '',
                bio: profileData.bio || '',
                address: {
                    street: profileData.address?.street || '',
                    city: profileData.address?.city || '',
                    state: profileData.address?.state || '',
                    zipCode: profileData.address?.zipCode || '',
                    country: profileData.address?.country || 'Bangladesh'
                }
            });
        }
    }, [profileData]);

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

    const validateField = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'fullName':
                if (!value.trim()) {
                    newErrors.fullName = 'Full name is required';
                } else if (value.trim().length < 2) {
                    newErrors.fullName = 'Full name must be at least 2 characters';
                } else {
                    delete newErrors.fullName;
                }
                break;
            case 'phoneNumber':
                if (value && !/^[\+]?[0-9\s\-\(\)]{10,15}$/.test(value)) {
                    newErrors.phoneNumber = 'Please enter a valid phone number';
                } else {
                    delete newErrors.phoneNumber;
                }
                break;
            case 'alternatePhone':
                if (value && !/^[\+]?[0-9\s\-\(\)]{10,15}$/.test(value)) {
                    newErrors.alternatePhone = 'Please enter a valid phone number';
                } else {
                    delete newErrors.alternatePhone;
                }
                break;
            case 'dateOfBirth':
                if (value) {
                    const birthDate = new Date(value);
                    const today = new Date();
                    const age = today.getFullYear() - birthDate.getFullYear();
                    if (age < 16 || age > 100) {
                        newErrors.dateOfBirth = 'Age must be between 16 and 100 years';
                    } else {
                        delete newErrors.dateOfBirth;
                    }
                }
                break;
            case 'address.zipCode':
                if (value && !/^[0-9]{4,6}$/.test(value)) {
                    newErrors['address.zipCode'] = 'Please enter a valid ZIP code';
                } else {
                    delete newErrors['address.zipCode'];
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

        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        setHasChanges(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all fields before submission
        const fieldsToValidate = [
            { field: 'fullName', value: formData.fullName },
            { field: 'phoneNumber', value: formData.phoneNumber },
            { field: 'alternatePhone', value: formData.alternatePhone },
            { field: 'dateOfBirth', value: formData.dateOfBirth },
            { field: 'address.zipCode', value: formData.address.zipCode }
        ];
        
        let validationErrors = {};
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
            const result = await updateProfile(formData);

            if (result.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setIsEditing(false);
                setHasChanges(false);
                if (onDataChange) {
                    onDataChange(prev => ({ ...prev, ...formData }));
                }
                
                // Clear success message after 3 seconds
                setTimeout(() => {
                    setMessage({ type: '', text: '' });
                }, 3000);
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while updating profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form data to original profile data
        if (profileData) {
            setFormData({
                fullName: profileData.fullName || '',
                dateOfBirth: profileData.dateOfBirth ? profileData.dateOfBirth.split('T')[0] : '',
                gender: profileData.gender || 'prefer-not-to-say',
                phoneNumber: profileData.phoneNumber || '',
                alternatePhone: profileData.alternatePhone || '',
                bio: profileData.bio || '',
                address: {
                    street: profileData.address?.street || '',
                    city: profileData.address?.city || '',
                    state: profileData.address?.state || '',
                    zipCode: profileData.address?.zipCode || '',
                    country: profileData.address?.country || 'Bangladesh'
                }
            });
        }
        setIsEditing(false);
        setHasChanges(false);
        setErrors({});
        setMessage({ type: '', text: '' });
    };

    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return null;
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    };

    const calculateCompletionPercentage = () => {
        const fields = [
            formData.fullName,
            formData.dateOfBirth,
            formData.phoneNumber,
            formData.bio,
            formData.address.street,
            formData.address.city,
            formData.address.state,
            formData.address.zipCode
        ];
        
        const filledFields = fields.filter(field => field && field.trim() !== '').length;
        return Math.round((filledFields / fields.length) * 100);
    };

    return (
        <div className="personal-details">
            <div className="personal-details-header">
                <div className="header-left">
                    <h2>Personal Details</h2>
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

            <form onSubmit={handleSubmit} className="personal-details-form">
                <div className="form-section">
                    <h3>Basic Information</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name *</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                required
                                placeholder="Enter your full name"
                                className={errors.fullName ? 'error' : ''}
                            />
                            {errors.fullName && (
                                <span className="error-message">{errors.fullName}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="dateOfBirth">Date of Birth</label>
                            <input
                                type="date"
                                id="dateOfBirth"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                max={new Date().toISOString().split('T')[0]}
                                className={errors.dateOfBirth ? 'error' : ''}
                            />
                            {formData.dateOfBirth && (
                                <small className="age-display">
                                    Age: {calculateAge(formData.dateOfBirth)} years
                                </small>
                            )}
                            {errors.dateOfBirth && (
                                <span className="error-message">{errors.dateOfBirth}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="gender">Gender</label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            >
                                <option value="prefer-not-to-say">Prefer not to say</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="phoneNumber">
                                Phone Number
                                <span className="tooltip">
                                    <span className="tooltip-icon">ℹ️</span>
                                    <span className="tooltip-text">
                                        Include country code for international numbers (e.g., +880 for Bangladesh)
                                    </span>
                                </span>
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="+880 1234 567890"
                                className={errors.phoneNumber ? 'error' : ''}
                            />
                            {errors.phoneNumber && (
                                <span className="error-message">{errors.phoneNumber}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="alternatePhone">Alternate Phone</label>
                            <input
                                type="tel"
                                id="alternatePhone"
                                name="alternatePhone"
                                value={formData.alternatePhone}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="+880 1234 567890"
                                className={errors.alternatePhone ? 'error' : ''}
                            />
                            {errors.alternatePhone && (
                                <span className="error-message">{errors.alternatePhone}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="bio">
                            Bio
                            <span className="tooltip">
                                <span className="tooltip-icon">ℹ️</span>
                                <span className="tooltip-text">
                                    Write a brief description about yourself, your interests, and goals
                                </span>
                            </span>
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Tell us about yourself, your interests, career goals, and what makes you unique..."
                            maxLength={500}
                            rows={4}
                        />
                        <div className="textarea-footer">
                            <small className="char-count">
                                {formData.bio.length}/500 characters
                            </small>
                            {formData.bio.length > 450 && (
                                <small className="char-warning">
                                    {500 - formData.bio.length} characters remaining
                                </small>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Address Information</h3>
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label htmlFor="address.street">Street Address</label>
                            <input
                                type="text"
                                id="address.street"
                                name="address.street"
                                value={formData.address.street}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Enter your street address"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address.city">City</label>
                            <input
                                type="text"
                                id="address.city"
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Enter your city"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address.state">State/Division</label>
                            <input
                                type="text"
                                id="address.state"
                                name="address.state"
                                value={formData.address.state}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Enter your state or division"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address.zipCode">ZIP/Postal Code</label>
                            <input
                                type="text"
                                id="address.zipCode"
                                name="address.zipCode"
                                value={formData.address.zipCode}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Enter ZIP code"
                                className={errors['address.zipCode'] ? 'error' : ''}
                            />
                            {errors['address.zipCode'] && (
                                <span className="error-message">{errors['address.zipCode']}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="address.country">Country</label>
                            <select
                                id="address.country"
                                name="address.country"
                                value={formData.address.country}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            >
                                <option value="Bangladesh">Bangladesh</option>
                                <option value="India">India</option>
                                <option value="Pakistan">Pakistan</option>
                                <option value="Nepal">Nepal</option>
                                <option value="Sri Lanka">Sri Lanka</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PersonalDetails;