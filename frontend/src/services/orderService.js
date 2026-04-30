import axiosInstance from './api';

/**
 * Order Services
 */

export const orderService = {
  createOrder: async (data) => {
    const response = await axiosInstance.post('/orders', data);
    return response.data;
  },

  getUserOrders: async (filters = {}) => {
    const response = await axiosInstance.get('/orders', { params: filters });
    return response.data;
  },

  getOrderById: async (orderId) => {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data;
  },

  updateOrderStatus: async (orderId, data) => {
    const response = await axiosInstance.put(`/orders/${orderId}`, data);
    return response.data;
  }
};

export default orderService;
