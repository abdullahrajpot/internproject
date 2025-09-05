import { useState, useEffect } from 'react';
import { useAuth } from '../Contexts/AuthContext';

export const useProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !user || user.role !== 'intern') {
        setLoading(false);
        return;
      }

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
          // Profile doesn't exist yet
          setProfileData(null);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, user]);

  return { profileData, loading, setProfileData };
};