import { createContext, useState, useCallback, useEffect } from 'react';
import socketService from '../services/socketService';

/**
 * Chat Context
 */
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});

  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const markMessageRead = useCallback((messageIds) => {
    socketService.markAsRead(messageIds);
    setMessages(prev => 
      prev.map(msg => 
        messageIds.includes(msg.message_id) 
          ? { ...msg, is_read: true }
          : msg
      )
    );
  }, []);

  const setTyping = useCallback((chatId, userId, isTyping) => {
    if (isTyping) {
      socketService.typingStart(chatId, userId);
      setTypingUsers(prev => ({ ...prev, [userId]: true }));
    } else {
      socketService.typingStop(chatId, userId);
      setTypingUsers(prev => {
        const { [userId]: _, ...rest } = prev;
        return rest;
      });
    }
  }, []);

  useEffect(() => {
    // Listen for messages
    socketService.onMessageReceived((message) => {
      addMessage(message);
    });

    // Listen for online users
    socketService.onUsersOnline((users) => {
      setOnlineUsers(users);
    });

    // Listen for typing
    socketService.onTyping(({ userId }) => {
      setTypingUsers(prev => ({ ...prev, [userId]: true }));
      setTimeout(() => {
        setTypingUsers(prev => {
          const { [userId]: _, ...rest } = prev;
          return rest;
        });
      }, 3000);
    });
  }, [addMessage]);

  const value = {
    chats,
    setChats,
    currentChat,
    setCurrentChat,
    messages,
    setMessages,
    addMessage,
    markMessageRead,
    onlineUsers,
    isLoading,
    setIsLoading,
    typingUsers,
    setTyping
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;
