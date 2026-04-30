import { Server } from 'socket.io';
import Message from '../models/Message.js';

// Store active socket connections
const activeUsers = new Map();

/**
 * Initialize Socket.io for real-time communication
 * Handles chat and messaging features
 */
export const initializeSocketIO = (httpServer, corsOrigin) => {
  const io = new Server(httpServer, {
    cors: {
      origin: corsOrigin,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`✓ New user connected: ${socket.id}`);

    // User joins with their user_id
    socket.on('user:join', (userId) => {
      activeUsers.set(userId, socket.id);
      io.emit('users:online', Array.from(activeUsers.keys()));
      console.log(`User ${userId} is online`);
    });

    // User joins a specific chat room
    socket.on('chat:join', (chatId) => {
      socket.join(`chat:${chatId}`);
      console.log(`User joined chat room: ${chatId}`);
    });

    // Handle incoming messages
    socket.on('message:send', async (data) => {
      const { chatId, senderId, receiverId, messageText } = data;

      try {
        // Save message to database
        const message = await Message.create({
          chat_id: chatId,
          sender_id: senderId,
          receiver_id: receiverId,
          message_text: messageText,
          is_read: false,
          sent_at: new Date()
        });

        // Emit message to all clients in the chat room
        io.to(`chat:${chatId}`).emit('message:received', {
          message_id: message.message_id,
          chatId: chatId,
          senderId: senderId,
          messageText: messageText,
          sent_at: message.sent_at,
          is_read: false
        });

        console.log(`Message saved: ${message.message_id}`);
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Mark message as read
    socket.on('message:read', async (messageIds) => {
      try {
        await Message.update(
          { is_read: true, received_at: new Date() },
          { where: { message_id: messageIds } }
        );
        console.log(`Marked ${messageIds.length} messages as read`);
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // User typing indicator
    socket.on('typing:start', (data) => {
      const { chatId, userId } = data;
      socket.broadcast.to(`chat:${chatId}`).emit('typing:active', { 
        userId, 
        chatId 
      });
    });

    socket.on('typing:stop', (data) => {
      const { chatId, userId } = data;
      socket.broadcast.to(`chat:${chatId}`).emit('typing:inactive', { 
        userId, 
        chatId 
      });
    });

    // User disconnect
    socket.on('disconnect', () => {
      for (const [userId, socketId] of activeUsers.entries()) {
        if (socketId === socket.id) {
          activeUsers.delete(userId);
          io.emit('users:online', Array.from(activeUsers.keys()));
          console.log(`User ${userId} went offline`);
          break;
        }
      }
    });
  });

  return io;
};

export { activeUsers };
