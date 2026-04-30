import axiosInstance from './api';

/**
 * Review Services
 */

export const reviewService = {
  createReview: async (data) => {
    const response = await axiosInstance.post('/reviews', data);
    return response.data;
  },

  getUserReviews: async (userId, pagination = {}) => {
    const response = await axiosInstance.get(`/reviews/${userId}`, { params: pagination });
    return response.data;
  }
};

export default reviewService;
