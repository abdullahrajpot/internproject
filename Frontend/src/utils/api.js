import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't log 404 errors as they're expected when APIs don't exist
    if (error.response?.status !== 404) {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API helper functions
export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await api(endpoint, options);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: error.response?.status
    };
  }
};

// Specific API calls
export const fetchUsers = () => apiCall('/auth/users');
export const fetchTasks = () => apiCall('/task/assigned');
export const fetchAnalytics = () => apiCall('/analytics/dashboard');
export const fetchTaskTrends = () => apiCall('/analytics/task-trends');
export const fetchNotifications = () => apiCall('/analytics/notifications');
export const fetchInterneeAnalytics = () => apiCall('/analytics/internees');
export const fetchCourseAnalytics = () => apiCall('/analytics/courses');
export const fetchPerformanceTrends = () => apiCall('/analytics/performance-trends');
export const fetchTaskDistribution = () => apiCall('/analytics/task-distribution');

// Check if backend is running
export const checkBackendHealth = async () => {
  try {
    const response = await axios.get('http://localhost:5000/health', { timeout: 5000 });
    return { success: true, message: response.data };
  } catch (error) {
    // Try the main endpoint as fallback
    try {
      const response = await axios.get('http://localhost:5000/', { timeout: 5000 });
      return { success: true, message: response.data };
    } catch (fallbackError) {
      return {
        success: false,
        message: 'Backend server is not running or not accessible',
        details: error.code === 'ECONNREFUSED' ? 'Connection refused - server not started' : error.message
      };
    }
  }
};

export default api;