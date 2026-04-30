import axiosInstance from './api';

/**
 * Authentication Services
 */

export const authService = {
  register: async (data) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  login: async (data) => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  }
};

export default authService;
