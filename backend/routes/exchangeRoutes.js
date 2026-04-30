import express from 'express';
import {
  createExchange,
  getUserExchanges,
  acceptExchange,
  rejectExchange
} from '../controllers/exchangeController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Exchange Routes
 */

// Create exchange request
router.post('/', verifyToken, createExchange);

// Get user exchanges
router.get('/', verifyToken, getUserExchanges);

// Accept exchange
router.put('/:exchangeId/accept', verifyToken, acceptExchange);

// Reject exchange
router.put('/:exchangeId/reject', verifyToken, rejectExchange);

export default router;
