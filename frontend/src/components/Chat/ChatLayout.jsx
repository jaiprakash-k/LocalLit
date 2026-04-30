import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import useChat from '../../hooks/useChat';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import chatService from '../../services/chatService';
import socketService from '../../services/socketService';
import Navbar from '../Layout/Navbar';
import { MessageCircle } from 'lucide-react';

export const ChatLayout = () => {
  const { user } = useAuth();
  const { chats, setChats, currentChat, setCurrentChat } = useChat();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadChats();
      socketService.connect(user.user_id);
    }
  }, [user]);

  const loadChats = async () => {
    setLoading(true);
    try {
      const response = await chatService.getUserChats();
      setChats(response.chats || []);
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = async (chat) => {
    setCurrentChat(chat);
    socketService.joinChat(chat.chat_id);
    
    try {
      const response = await chatService.getChatById(chat.chat_id);
      setCurrentChat(response.chat);
    } catch (error) {
      console.error('Failed to load chat:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
      <Navbar />
      <div className="pt-20 h-[calc(100vh-80px)] flex">
        {/* Chat List Sidebar */}
        <div className="w-full md:w-80 bg-slate-800/40 backdrop-blur-sm border-r border-white/10 overflow-y-auto">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="h-6 w-6 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">Messages</h2>
            </div>
            {loading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mx-auto"></div>
              </div>
            )}
          </div>
          
          {!loading && chats && chats.length > 0 ? (
            <ChatList chats={chats} currentChat={currentChat} onSelectChat={handleSelectChat} />
          ) : (
            !loading && (
              <div className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-gray-500/50 mx-auto mb-3" />
                <p className="text-gray-400">No conversations yet</p>
              </div>
            )
          )}
        </div>

        {/* Chat Window */}
        {currentChat && user ? (
          <ChatWindow chat={currentChat} userId={user.user_id} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="glass-card p-12 text-center">
              <MessageCircle className="h-16 w-16 text-gray-500/50 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
