import express from 'express';
import {
  getMessages,
  markMessagesAsRead,
  deleteMessage
} from '../controllers/messageController.js';
import verifyToken from '../middleware/authMiddleware.js';
import { validateMessage, handleValidationErrors } from '../utils/validators.js';

const router = express.Router();

/**
 * Message Routes
 */

// Get messages for a chat
router.get('/:chatId', verifyToken, getMessages);

// Mark messages as read
router.put('/read', verifyToken, markMessagesAsRead);

// Delete message
router.delete('/:messageId', verifyToken, deleteMessage);

export default router;
