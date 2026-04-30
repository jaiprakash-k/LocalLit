import express from 'express';
import {
  createOrder,
  getUserOrders,
  updateOrderStatus,
  getOrderById
} from '../controllers/orderController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Order Routes
 */

// Create order
router.post('/', verifyToken, createOrder);

// Get user orders
router.get('/', verifyToken, getUserOrders);

// Get order by ID
router.get('/:orderId', verifyToken, getOrderById);

// Update order status
router.put('/:orderId', verifyToken, updateOrderStatus);

export default router;
