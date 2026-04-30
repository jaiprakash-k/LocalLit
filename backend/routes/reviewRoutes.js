import express from 'express';
import {
  createReview,
  getUserReviews
} from '../controllers/reviewController.js';
import verifyToken from '../middleware/authMiddleware.js';
import { validateReview, handleValidationErrors } from '../utils/validators.js';

const router = express.Router();

/**
 * Review Routes
 */

// Create review
router.post('/', verifyToken, validateReview, handleValidationErrors, createReview);

// Get user reviews
router.get('/:userId', getUserReviews);

export default router;
