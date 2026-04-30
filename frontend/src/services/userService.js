import axiosInstance from './api';

/**
 * User Services
 */

export const userService = {
  getCurrentUser: async () => {
    const response = await axiosInstance.get('/users/me');
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await axiosInstance.put('/users/me/profile', data);
    return response.data;
  },

  uploadProfileImage: async (formData) => {
    const response = await axiosInstance.post('/users/me/upload-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getUserStats: async () => {
    const response = await axiosInstance.get('/users/me/stats');
    return response.data;
  }
};

export default userService;
