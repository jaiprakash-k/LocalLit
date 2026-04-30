import axiosInstance from './api';

/**
 * Book Services
 */

export const bookService = {
  getAllBooks: async (filters = {}) => {
    const response = await axiosInstance.get('/books', { params: filters });
    return response.data;
  },

  getBookById: async (bookId) => {
    const response = await axiosInstance.get(`/books/${bookId}`);
    return response.data;
  },

  createBook: async (formData) => {
    const response = await axiosInstance.post('/books', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateBook: async (bookId, data) => {
    const response = await axiosInstance.put(`/books/${bookId}`, data);
    return response.data;
  },

  deleteBook: async (bookId) => {
    const response = await axiosInstance.delete(`/books/${bookId}`);
    return response.data;
  },

  getBooksBySeller: async (sellerId, pagination = {}) => {
    const response = await axiosInstance.get(`/books/seller/${sellerId}`, { params: pagination });
    return response.data;
  },

  getCategories: async () => {
    const response = await axiosInstance.get('/books/categories');
    return response.data;
  }
};

export default bookService;
