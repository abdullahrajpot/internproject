import { useState, useEffect } from 'react';
import { useAuth } from '../Contexts/AuthContext';

const API_BASE_URL = 'http://localhost:5000/api';

export const useCourses = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async (filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const url = `${API_BASE_URL}/courses?${queryParams}`;
      console.log('Fetching courses from:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Courses fetched:', data);
        setCourses(data);
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to fetch courses');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCourseById = async (courseId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
      
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Course not found');
      }
    } catch (err) {
      throw err;
    }
  };

  const getCourseWithProgress = async (courseId) => {
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/with-progress`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to fetch course with progress');
      }
    } catch (err) {
      throw err;
    }
  };

  const getVideoDetails = async (courseId, moduleId, videoId) => {
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/module/${moduleId}/video/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to fetch video details');
      }
    } catch (err) {
      throw err;
    }
  };

  const rateCourse = async (courseId, rating, review = '') => {
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/rate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating, review })
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to rate course');
      }
    } catch (err) {
      throw err;
    }
  };

  const getCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/meta/categories`);
      
      if (response.ok) {
        return await response.json();
      } else {
        return [];
      }
    } catch (err) {
      return [];
    }
  };

  const getCourseStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/meta/stats`);
      
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    fetchCourses,
    getCourseById,
    getCourseWithProgress,
    getVideoDetails,
    rateCourse,
    getCategories,
    getCourseStats
  };
};