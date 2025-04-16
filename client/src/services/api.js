import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/token/', { username, password });
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  register: async (userData) => {
    // Check if userData is FormData
    const isFormData = userData instanceof FormData;
    
    // Configure the request based on the data type
    const config = isFormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    } : {};
    
    const response = await api.post('/users/', userData, config);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me/');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      throw error;
    }
  },
};

// User services
export const userService = {
  updateProfile: async (userData) => {
    try {
      // For multipart/form-data (file uploads)
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const response = await api.post('/users/me/update/', userData, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Post services
export const postService = {
  getAllPosts: async () => {
    try {
      const response = await api.get('/posts/');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      throw error;
    }
  },
  getUnmoderatedPosts: async () => {
    try {
      const response = await api.get('/posts/unmoderated/');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      throw error;
    }
  },
  getPost: async (id) => {
    const response = await api.get(`/posts/${id}/`);
    return response.data;
  },
  createPost: async (postData) => {
    try {
      const response = await api.post('/posts/', postData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      throw error;
    }
  },
  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}/`, postData);
    return response.data;
  },
  deletePost: async (id) => {
    await api.delete(`/posts/${id}/`);
  },
  moderatePost: async (id, action) => {
    const response = await api.post(`/posts/${id}/moderate/`, { action });
    return response.data;
  },
  likePost: async (id, action = 'like') => {
    const response = await api.post(`/posts/${id}/like/`, { action });
    return response.data;
  },
  getCommentsByPostId: async (postId) => {
    try {
      const response = await api.get(`/comments/?post=${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },
};

// Comment services
export const commentService = {
  createComment: async (commentData) => {
    const response = await api.post('/comments/', commentData);
    return response.data;
  },
  updateComment: async (id, commentData) => {
    const response = await api.put(`/comments/${id}/`, commentData);
    return response.data;
  },
  deleteComment: async (id) => {
    await api.delete(`/comments/${id}/`);
  },
};

export default api; 