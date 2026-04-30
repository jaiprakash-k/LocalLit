import axiosInstance from './api';

/**
 * Exchange Services
 */

export const exchangeService = {
  createExchange: async (data) => {
    const response = await axiosInstance.post('/exchanges', data);
    return response.data;
  },

  getUserExchanges: async (filters = {}) => {
    const response = await axiosInstance.get('/exchanges', { params: filters });
    return response.data;
  },

  acceptExchange: async (exchangeId) => {
    const response = await axiosInstance.put(`/exchanges/${exchangeId}/accept`);
    return response.data;
  },

  rejectExchange: async (exchangeId) => {
    const response = await axiosInstance.put(`/exchanges/${exchangeId}/reject`);
    return response.data;
  }
};

export default exchangeService;
