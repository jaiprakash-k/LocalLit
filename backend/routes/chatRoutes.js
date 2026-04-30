import express from 'express';
import {
  createChat,
  getUserChats,
  getChatById,
  deleteChat
} from '../controllers/chatController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Chat Routes
 */

// Create chat
router.post('/', verifyToken, createChat);

// Get user chats
router.get('/', verifyToken, getUserChats);

// Get chat by ID
router.get('/:chatId', verifyToken, getChatById);

// Delete chat
router.delete('/:chatId', verifyToken, deleteChat);

export default router;
