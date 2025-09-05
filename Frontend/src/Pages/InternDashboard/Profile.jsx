import React, { useState, useEffect } from 'react';
import PersonalDetails from '../../components/Profile/PersonalDetails';
import EducationDetails from '../../components/Profile/EducationDetails';
import ProfilePictureUpload from '../../components/Profile/ProfilePictureUpload';
import Notification from '../../components/Profile/Notification';
import Privacy from '../../components/Profile/Privacy';
import Payment from '../../components/Profile/Payment';
import InviteFriends from '../../components/Profile/InviteFriends';
import DeleteAccount from '../../components/Profile/DeleteAccount';
import ProfileSidebar from '../../components/Profile/ProfileSidebar';
import ProfileAvatar from '../../components/common/ProfileAvatar';
import './Profile.css';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    // Handle window resize for responsive behavior
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);

            // Auto-close sidebar on mobile when switching tabs
            if (mobile && sidebarOpen) {
                setSidebarOpen(false);
            }

            // Reset collapsed state when switching to mobile
            if (mobile) {
                setSidebarCollapsed(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [sidebarOpen]);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobile && sidebarOpen && !event.target.closest('.profile-sidebar-container')) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobile, sidebarOpen]);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/intern-profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProfileData(data);
            } else if (response.status === 404) {
                // Profile doesn't exist yet, create empty structure
                setProfileData({
                    fullName: '',
                    phoneNumber: '',
                    address: {
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: 'Bangladesh'
                    },
                    education: {
                        currentLevel: '',
                        institution: '',
                        major: '',
                        skills: []
                    },
                    internshipDetails: {
                        coursesInProgress: 0,
                        coursesCompleted: 0
                    },
                    achievements: []
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (updatedData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/intern-profile', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                const data = await response.json();
                setProfileData(data);
                return { success: true };
            } else {
                return { success: false, error: 'Failed to update profile' };
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            return { success: false, error: 'Network error' };
        }
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'personal':
                return (
                    <div className="tab-content-wrapper">
                        <ProfilePictureUpload
                            profileData={profileData}
                            onProfileUpdate={setProfileData}
                        />
                        <div className="details-grid">
                            <PersonalDetails
                                profileData={profileData}
                                updateProfile={updateProfile}
                                onDataChange={setProfileData}
                            />
                            {/* <EducationDetails 
                profileData={profileData} 
                updateProfile={updateProfile}
                onDataChange={setProfileData}
              /> */}
                        </div>
                    </div>
                );
            case 'education':
                return (
                    <EducationDetails
                        profileData={profileData}
                        updateProfile={updateProfile}
                        onDataChange={setProfileData}
                    />
                );
            case 'notification':
                return <Notification />;
            case 'privacy':
                return <Privacy profileData={profileData} updateProfile={updateProfile} />;
            case 'payment':
                return <Payment />;
            case 'invite':
                return <InviteFriends />;
            case 'delete':
                return <DeleteAccount />;
            default:
                return (
                    <div className="tab-content-wrapper">
                        <ProfilePictureUpload
                            profileData={profileData}
                            onProfileUpdate={setProfileData}
                        />
                        <div className="details-grid">
                            <PersonalDetails
                                profileData={profileData}
                                updateProfile={updateProfile}
                                onDataChange={setProfileData}
                            />
                            <EducationDetails
                                profileData={profileData}
                                updateProfile={updateProfile}
                                onDataChange={setProfileData}
                            />
                        </div>
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="loading-spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="header-left">
                    <button
                        className="sidebar-toggle"
                        onClick={() => {
                            if (isMobile) {
                                setSidebarOpen(!sidebarOpen);
                            } else {
                                setSidebarCollapsed(!sidebarCollapsed);
                            }
                        }}
                        aria-label={isMobile ? "Toggle sidebar" : "Collapse sidebar"}
                        title={isMobile ? "Toggle sidebar" : (sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar")}
                    >
                        <span className={`hamburger ${(isMobile && sidebarOpen) || (!isMobile && sidebarCollapsed) ? 'active' : ''}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </button>
                    <h1>Profile</h1>
                </div>
                <div className="profile-user-info">
                    <ProfileAvatar
                        profileData={profileData}
                        size="medium"
                    />
                    <span>{profileData?.fullName || 'Intern'}</span>
                </div>
            </div>

            <div className={`profile-content ${!isMobile && sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                {/* Sidebar overlay for mobile */}
                {isMobile && sidebarOpen && (
                    <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
                )}

                <div className={`profile-sidebar-container ${sidebarOpen ? 'open' : ''}`}>
                    <ProfileSidebar
                        profileData={profileData}
                        activeTab={activeTab}
                        setActiveTab={(tab) => {
                            setActiveTab(tab);
                            if (isMobile) setSidebarOpen(false);
                        }}
                        onClose={() => setSidebarOpen(false)}
                        isMobile={isMobile}
                    />
                </div>

                <div className="profile-main">
                    <div className="profile-tabs">
                        <button
                            className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
                            onClick={() => setActiveTab('personal')}
                        >
                            Personal Details
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'education' ? 'active' : ''}`}
                            onClick={() => setActiveTab('education')}
                        >
                            Education
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'notification' ? 'active' : ''}`}
                            onClick={() => setActiveTab('notification')}
                        >
                            Notification
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'privacy' ? 'active' : ''}`}
                            onClick={() => setActiveTab('privacy')}
                        >
                            Privacy
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'payment' ? 'active' : ''}`}
                            onClick={() => setActiveTab('payment')}
                        >
                            Payment
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'invite' ? 'active' : ''}`}
                            onClick={() => setActiveTab('invite')}
                        >
                            Invite Friends
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'delete' ? 'active' : ''}`}
                            onClick={() => setActiveTab('delete')}
                        >
                            Delete Account
                        </button>
                    </div>

                    <div className="profile-tab-content">
                        {renderActiveTab()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;