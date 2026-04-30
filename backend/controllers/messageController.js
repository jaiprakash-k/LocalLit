import { Message, Chat } from '../models/index.js';

/**
 * Get messages for a chat
 */
export const getMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Message.findAndCountAll({
      where: { chat_id: chatId },
      order: [['sent_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Reverse to get chronological order
    rows.reverse();

    res.status(200).json({
      success: true,
      messages: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (req, res, next) => {
  try {
    const { messageIds } = req.body;

    await Message.update(
      { is_read: true, received_at: new Date() },
      { where: { message_id: messageIds } }
    );

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete message
 */
export const deleteMessage = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { messageId } = req.params;

    const message = await Message.findByPk(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Only sender can delete their message
    if (message.sender_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    await message.destroy();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
