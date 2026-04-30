import axiosInstance from './api';

/**
 * Chat Services
 */

export const chatService = {
  createChat: async (data) => {
    const response = await axiosInstance.post('/chats', data);
    return response.data;
  },

  getUserChats: async (pagination = {}) => {
    const response = await axiosInstance.get('/chats', { params: pagination });
    return response.data;
  },

  getChatById: async (chatId) => {
    const response = await axiosInstance.get(`/chats/${chatId}`);
    return response.data;
  },

  deleteChat: async (chatId) => {
    const response = await axiosInstance.delete(`/chats/${chatId}`);
    return response.data;
  },

  getMessages: async (chatId, pagination = {}) => {
    const response = await axiosInstance.get(`/messages/${chatId}`, { params: pagination });
    return response.data;
  },

  markAsRead: async (messageIds) => {
    const response = await axiosInstance.put('/messages/read', { messageIds });
    return response.data;
  },

  deleteMessage: async (messageId) => {
    const response = await axiosInstance.delete(`/messages/${messageId}`);
    return response.data;
  }
};

export default chatService;
