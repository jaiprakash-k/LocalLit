import express from 'express';
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  getBooksBySeller,
  getCategories
} from '../controllers/bookController.js';
import verifyToken, { optionalVerifyToken } from '../middleware/authMiddleware.js';
import { uploadMultipleImages, handleUploadError } from '../middleware/uploadMiddleware.js';
import { validateBook, handleValidationErrors } from '../utils/validators.js';

const router = express.Router();

/**
 * Book Routes
 */

// Get all books (with optional filters)
router.get('/', optionalVerifyToken, getAllBooks);

// Get book categories
router.get('/categories', getCategories);

// Get books by seller
router.get('/seller/:sellerId', getBooksBySeller);

// Create book
router.post('/', verifyToken, uploadMultipleImages, handleUploadError, validateBook, handleValidationErrors, createBook);

// Get book by ID
router.get('/:bookId', getBookById);

// Update book
router.put('/:bookId', verifyToken, validateBook, handleValidationErrors, updateBook);

// Delete book
router.delete('/:bookId', verifyToken, deleteBook);

export default router;
