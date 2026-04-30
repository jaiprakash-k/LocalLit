import express from 'express';
import {
  getCurrentUser,
  getUserById,
  updateProfile,
  uploadProfileImage,
  getUserStats
} from '../controllers/userController.js';
import verifyToken from '../middleware/authMiddleware.js';
import { uploadSingleImage, handleUploadError } from '../middleware/uploadMiddleware.js';
import { validateProfileUpdate, handleValidationErrors } from '../utils/validators.js';

const router = express.Router();

/**
 * User Routes
 */

// Get current user
router.get('/me', verifyToken, getCurrentUser);

// Get user by ID (public)
router.get('/:userId', getUserById);

// Update profile (authenticated)
router.put('/me/profile', verifyToken, validateProfileUpdate, handleValidationErrors, updateProfile);

// Upload profile image
router.post('/me/upload-avatar', verifyToken, uploadSingleImage, handleUploadError, uploadProfileImage);

// Get user stats
router.get('/me/stats', verifyToken, getUserStats);

export default router;
