import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5002';

/**
 * Initialize Socket.io connection
 */
export const socketService = {
  socket: null,

  connect: (userId) => {
    if (socketService.socket) return socketService.socket;

    socketService.socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socketService.socket.emit('user:join', userId);
    console.log('Socket connected');
    return socketService.socket;
  },

  joinChat: (chatId) => {
    if (socketService.socket) {
      socketService.socket.emit('chat:join', chatId);
    }
  },

  sendMessage: (chatId, senderId, receiverId, messageText) => {
    if (socketService.socket) {
      socketService.socket.emit('message:send', {
        chatId,
        senderId,
        receiverId,
        messageText
      });
    }
  },

  markAsRead: (messageIds) => {
    if (socketService.socket) {
      socketService.socket.emit('message:read', messageIds);
    }
  },

  onMessageReceived: (callback) => {
    if (socketService.socket) {
      socketService.socket.on('message:received', callback);
    }
  },

  onTyping: (callback) => {
    if (socketService.socket) {
      socketService.socket.on('typing:active', callback);
    }
  },

  onUsersOnline: (callback) => {
    if (socketService.socket) {
      socketService.socket.on('users:online', callback);
    }
  },

  typingStart: (chatId, userId) => {
    if (socketService.socket) {
      socketService.socket.emit('typing:start', { chatId, userId });
    }
  },

  typingStop: (chatId, userId) => {
    if (socketService.socket) {
      socketService.socket.emit('typing:stop', { chatId, userId });
    }
  },

  disconnect: () => {
    if (socketService.socket) {
      socketService.socket.disconnect();
    }
  }
};

export default socketService;
