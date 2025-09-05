import { useState, useEffect } from 'react';
import { useAuth } from '../Contexts/AuthContext';

const API_BASE_URL = 'http://localhost:5000/api';

export const useUserProgress = () => {
  const { user, token } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProgress = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProgress(data);
      } else {
        throw new Error('Failed to fetch progress');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const enrollInCourse = async (courseId) => {
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE_URL}/progress/enroll/${courseId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        await fetchProgress(); // Refresh progress
        return data;
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to enroll');
      }
    } catch (err) {
      throw err;
    }
  };

  const enrollInRoadmap = async (roadmapId) => {
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE_URL}/progress/enroll-roadmap/${roadmapId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        await fetchProgress(); // Refresh progress
        return data;
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to enroll in roadmap');
      }
    } catch (err) {
      throw err;
    }
  };

  const updateVideoProgress = async (courseId, moduleId, videoId, watchedDuration, completed = false, timeSpent = 0) => {
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE_URL}/progress/video/${courseId}/${moduleId}/${videoId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          watchedDuration,
          completed,
          timeSpent
        })
      });

      if (response.ok) {
        await fetchProgress(); // Refresh progress
        return true;
      } else {
        throw new Error('Failed to update progress');
      }
    } catch (err) {
      throw err;
    }
  };

  const addVideoNote = async (courseId, moduleId, videoId, timestamp, content) => {
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE_URL}/progress/video/${courseId}/${moduleId}/${videoId}/notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timestamp,
          content
        })
      });

      if (response.ok) {
        const data = await response.json();
        await fetchProgress(); // Refresh progress
        return data.note;
      } else {
        throw new Error('Failed to add note');
      }
    } catch (err) {
      throw err;
    }
  };

  const getVideoNotes = async (courseId, moduleId, videoId) => {
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE_URL}/progress/video/${courseId}/${moduleId}/${videoId}/notes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to fetch notes');
      }
    } catch (err) {
      throw err;
    }
  };

  const toggleCourseBookmark = async (courseId) => {
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE_URL}/progress/course/${courseId}/bookmark`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        await fetchProgress(); // Refresh progress
        return data.bookmarked;
      } else {
        throw new Error('Failed to toggle bookmark');
      }
    } catch (err) {
      throw err;
    }
  };

  const toggleRoadmapBookmark = async (roadmapId) => {
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE_URL}/progress/roadmap/${roadmapId}/bookmark`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        await fetchProgress(); // Refresh progress
        return data.bookmarked;
      } else {
        throw new Error('Failed to toggle roadmap bookmark');
      }
    } catch (err) {
      throw err;
    }
  };

  const updateRoadmapVideoProgress = async (roadmapId, stepId, videoId, watchedDuration, completed = false, timeSpent = 0) => {
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE_URL}/progress/roadmap/${roadmapId}/step/${stepId}/video/${videoId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          watchedDuration,
          completed,
          timeSpent
        })
      });

      if (response.ok) {
        await fetchProgress(); // Refresh progress
        return true;
      } else {
        throw new Error('Failed to update video progress');
      }
    } catch (err) {
      throw err;
    }
  };

  const addRoadmapVideoNote = async (roadmapId, stepId, videoId, timestamp, content) => {
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE_URL}/progress/roadmap/${roadmapId}/step/${stepId}/video/${videoId}/notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timestamp,
          content
        })
      });

      if (response.ok) {
        const data = await response.json();
        await fetchProgress(); // Refresh progress
        return data.note;
      } else {
        throw new Error('Failed to add note');
      }
    } catch (err) {
      throw err;
    }
  };

  const toggleRoadmapVideoBookmark = async (roadmapId, stepId, videoId) => {
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE_URL}/progress/roadmap/${roadmapId}/step/${stepId}/video/${videoId}/bookmark`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        await fetchProgress(); // Refresh progress
        return data.bookmarked;
      } else {
        throw new Error('Failed to toggle video bookmark');
      }
    } catch (err) {
      throw err;
    }
  };

  const editRoadmapVideoNote = async (roadmapId, stepId, videoId, noteId, content) => {
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE_URL}/progress/roadmap/${roadmapId}/step/${stepId}/video/${videoId}/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });

      if (response.ok) {
        const data = await response.json();
        await fetchProgress(); // Refresh progress
        return data.note;
      } else {
        throw new Error('Failed to edit note');
      }
    } catch (err) {
      throw err;
    }
  };

  const deleteRoadmapVideoNote = async (roadmapId, stepId, videoId, noteId) => {
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE_URL}/progress/roadmap/${roadmapId}/step/${stepId}/video/${videoId}/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchProgress(); // Refresh progress
        return true;
      } else {
        throw new Error('Failed to delete note');
      }
    } catch (err) {
      throw err;
    }
  };

  const getCourseProgress = async (courseId) => {
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE_URL}/progress/course/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        return null; // Not enrolled
      }
    } catch (err) {
      return null;
    }
  };

  const getAchievements = async () => {
    if (!token) return [];

    try {
      const response = await fetch(`${API_BASE_URL}/progress/achievements`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        return [];
      }
    } catch (err) {
      return [];
    }
  };

  const updatePreferences = async (preferences) => {
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE_URL}/progress/preferences`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ preferences })
      });

      if (response.ok) {
        await fetchProgress(); // Refresh progress
        return true;
      } else {
        throw new Error('Failed to update preferences');
      }
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [token]);

  return {
    progress,
    loading,
    error,
    enrollInCourse,
    enrollInRoadmap,
    updateVideoProgress,
    updateRoadmapVideoProgress,
    addVideoNote,
    addRoadmapVideoNote,
    editRoadmapVideoNote,
    deleteRoadmapVideoNote,
    getVideoNotes,
    toggleCourseBookmark,
    toggleRoadmapBookmark,
    toggleVideoBookmark: toggleRoadmapVideoBookmark,
    getCourseProgress,
    getAchievements,
    updatePreferences,
    refreshProgress: fetchProgress
  };
};