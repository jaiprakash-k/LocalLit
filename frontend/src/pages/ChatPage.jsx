import React, { useState, useRef, useEffect } from 'react';
import { Send, Search, BookOpen, ArrowLeft } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import ChatMessage from '../components/Chat/ChatMessage';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import useAuth from '../hooks/useAuth';
import useChat from '../hooks/useChat';
import chatService from '../services/chatService';
import socketService from '../services/socketService';

const ChatPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chatIdParam = searchParams.get('id');
  const { user } = useAuth();
  const { chats, setChats, messages, setMessages, addMessage } = useChat();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  
  useEffect(() => {
    if (user) {
      socketService.connect(user.user_id || user.id);
    }
    loadChats();
    return () => {
      // Disconnect or just leave it for global use
    };
  }, [user]);
  
  useEffect(() => {
    if (chatIdParam && chats.length > 0) {
      const id = parseInt(chatIdParam);
      if (selectedChat !== id) {
        setSelectedChat(id);
        loadMessages(id);
      }
    }
  }, [chatIdParam, chats]);

  useEffect(() => { if (selectedChat) scrollToBottom(); }, [messages, selectedChat]);

  const loadChats = async () => {
    setLoading(true);
    try {
      const response = await chatService.getUserChats();
      const chatList = response?.chats || response?.data || response || [];
      const userId = user?.id || user?.user_id;
      const formattedChats = Array.isArray(chatList) ? chatList.map(c => {
        const otherUser = c.sender_id === userId ? c.receiver : c.sender;
        return {
          ...c,
          other_user_name: otherUser?.name || 'User',
          other_user_id: otherUser?.user_id || otherUser?.id,
          book_title: c.book?.title
        };
      }) : [];
      setChats(formattedChats);
    } catch (err) {
      console.error('Failed to load chats:', err);
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId) => {
    setMessagesLoading(true);
    try {
      const response = await chatService.getMessages(chatId);
      const msgList = response?.messages || response?.data || response || [];
      setMessages(Array.isArray(msgList) ? msgList : []);
      socketService.joinChat(chatId);
    } catch (err) {
      console.error('Failed to load messages:', err);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSelectChat = (chatId) => {
    setSelectedChat(chatId);
    loadMessages(chatId);
    if (chatIdParam !== String(chatId)) {
      navigate(`/chat?id=${chatId}`, { replace: true });
    }
  };

  const handleSend = () => {
    if (!message.trim() || !selectedChat) return;
    const currentChat = chats.find(c => (c.id || c.chat_id) === selectedChat);
    const receiverId = currentChat?.user_id || currentChat?.other_user_id;
    socketService.sendMessage(selectedChat, user?.id || user?.user_id, receiverId, message);
    addMessage({
      id: Date.now(),
      message_id: Date.now(),
      text: message,
      message_text: message,
      sender_id: user?.id || user?.user_id,
      sender_name: user?.name || 'You',
      created_at: new Date(),
    });
    setMessage('');
  };

  const filteredChats = searchQuery
    ? chats.filter(c => (c.user_name || c.other_user_name || '').toLowerCase().includes(searchQuery.toLowerCase()))
    : chats;

  const currentChatData = chats.find(c => (c.id || c.chat_id) === selectedChat);
  const userId = user?.id || user?.user_id;

  const ChatListItem = ({ chat }) => {
    const chatId = chat.id || chat.chat_id;
    return (
      <button
        onClick={() => handleSelectChat(chatId)}
        className="w-full flex items-start gap-3 px-4 py-3 transition-colors text-left"
        style={{
          background: selectedChat === chatId ? 'rgba(122, 79, 30, 0.05)' : 'transparent',
          borderLeft: selectedChat === chatId ? '3px solid #7A4F1E' : '3px solid transparent',
        }}
        onMouseEnter={(e) => { if (selectedChat !== chatId) e.currentTarget.style.background = 'rgba(122, 79, 30, 0.03)'; }}
        onMouseLeave={(e) => { if (selectedChat !== chatId) e.currentTarget.style.background = 'transparent'; }}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7A4F1E, #C4893A)', color: 'white' }}>
          {(chat.user_name || chat.other_user_name || '?').charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold truncate" style={{ color: '#2C2417' }}>{chat.user_name || chat.other_user_name || 'User'}</p>
            <span className="text-[10px] flex-shrink-0" style={{ color: '#B3A394' }}>
              {chat.last_message_time ? new Date(chat.last_message_time).toLocaleDateString() : ''}
            </span>
          </div>
          <p className="text-xs truncate mt-0.5" style={{ color: '#8C7B6A' }}>{chat.last_message || chat.last_message_text || ''}</p>
        </div>
        {chat.unread_count > 0 && <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
          style={{ background: '#2A6B5C' }}>{chat.unread_count}</span>}
      </button>
    );
  };

  return (
    <div style={{ background: '#FAF6EE', minHeight: '100vh' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" style={{ height: 'calc(100vh - 56px)' }}>
        <div className="flex h-full rounded-lg overflow-hidden" style={{ background: '#FFFCF5', border: '0.5px solid rgba(122, 79, 30, 0.1)' }}>
          {/* Sidebar */}
          <div className={`w-80 flex-shrink-0 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}
            style={{ borderRight: '0.5px solid rgba(122, 79, 30, 0.1)' }}>
            <div className="p-4" style={{ borderBottom: '0.5px solid rgba(122, 79, 30, 0.08)' }}>
              <h2 className="text-lg font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417' }}>Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#8C7B6A' }} />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search conversations..."
                  className="input-field pl-9 py-2 text-sm" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? <LoadingSpinner message="Loading chats..." /> : (
                filteredChats.length > 0
                  ? filteredChats.map(c => <ChatListItem key={c.id || c.chat_id} chat={c} />)
                  : <div className="text-center py-12"><p className="text-sm" style={{ color: '#B3A394' }}>No conversations yet</p></div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className={`flex-1 flex flex-col ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
            {selectedChat ? (
              <>
                <div className="px-5 py-3 flex items-center justify-between" style={{ background: '#FFFCF5', borderBottom: '0.5px solid rgba(122, 79, 30, 0.08)' }}>
                  <div className="flex items-center gap-3">
                    <button className="md:hidden p-1 rounded-full hover:bg-neutral-100" onClick={() => { setSelectedChat(null); navigate('/chat', { replace: true }); }}>
                      <ArrowLeft className="h-5 w-5" style={{ color: '#7A4F1E' }} />
                    </button>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: 'linear-gradient(135deg, #7A4F1E, #C4893A)', color: 'white' }}>
                      {(currentChatData?.user_name || currentChatData?.other_user_name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#2C2417' }}>{currentChatData?.user_name || currentChatData?.other_user_name || 'User'}</p>
                    </div>
                  </div>
                  {(currentChatData?.book_title) && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{ background: 'rgba(122, 79, 30, 0.06)', border: '0.5px solid rgba(122, 79, 30, 0.1)', color: '#7A4F1E' }}>
                      <BookOpen className="h-3 w-3" /> {currentChatData.book_title}
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4" style={{ background: '#FAF6EE' }}>
                  {messagesLoading ? <LoadingSpinner message="Loading messages..." /> : (
                    messages.length > 0
                      ? messages.map(msg => (
                          <ChatMessage key={msg.id || msg.message_id}
                            message={msg.text || msg.message_text || msg.content || ''}
                            isOutgoing={(msg.sender_id) === userId}
                            senderName={msg.sender_name || ''}
                            timestamp={msg.created_at} />
                        ))
                      : <div className="text-center py-12"><p className="text-sm" style={{ color: '#B3A394' }}>No messages yet. Start the conversation!</p></div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="px-5 py-3" style={{ background: '#FFFCF5', borderTop: '0.5px solid rgba(122, 79, 30, 0.08)' }}>
                  <div className="flex items-center gap-3">
                    <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type a message..." className="input-field flex-1 py-2.5" />
                    <button onClick={handleSend}
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-white"
                      style={{ background: message.trim() ? '#2A6B5C' : '#D5CBBD' }}>
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(122, 79, 30, 0.06)' }}>
                    <BookOpen className="h-8 w-8" style={{ color: '#B3A394' }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417' }}>Select a conversation</h3>
                  <p className="text-sm" style={{ color: '#8C7B6A' }}>Choose a chat to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
