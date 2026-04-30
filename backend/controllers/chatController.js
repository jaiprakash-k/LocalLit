import { Chat, Message, User, Book } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Create or get existing chat
 */
export const createChat = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { book_id, receiver_id } = req.body;

    // Check if chat already exists
    let chat = await Chat.findOne({
      where: {
        book_id,
        [Op.or]: [
          { sender_id: userId, receiver_id },
          { sender_id: receiver_id, receiver_id: userId }
        ]
      }
    });

    if (!chat) {
      chat = await Chat.create({
        book_id,
        sender_id: userId,
        receiver_id
      });
    }

    res.status(201).json({
      success: true,
      chat
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all chats for current user
 */
export const getUserChats = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const chats = await Chat.findAll({
      where: {
        [Op.or]: [{ sender_id: userId }, { receiver_id: userId }]
      },
      include: [
        { model: Book, as: 'book', include: [{ model: User, as: 'seller', attributes: ['name'] }] },
        { model: User, as: 'sender', attributes: ['user_id', 'name', 'email'] },
        { model: User, as: 'receiver', attributes: ['user_id', 'name', 'email'] }
      ],
      order: [['sent_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      chats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get chat by ID with messages
 */
export const getChatById = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findByPk(chatId, {
      include: [
        { model: Book, as: 'book' },
        { model: User, as: 'sender', attributes: ['user_id', 'name', 'email'] },
        { model: User, as: 'receiver', attributes: ['user_id', 'name', 'email'] },
        {
          model: Message,
          as: 'messages',
          include: [
            { model: User, as: 'sender', attributes: ['user_id', 'name'] },
            { model: User, as: 'receiver', attributes: ['user_id', 'name'] }
          ]
        }
      ]
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    res.status(200).json({
      success: true,
      chat
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete chat
 */
export const deleteChat = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { chatId } = req.params;

    const chat = await Chat.findByPk(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Verify user is part of chat
    if (chat.sender_id !== userId && chat.receiver_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    await chat.destroy();

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
