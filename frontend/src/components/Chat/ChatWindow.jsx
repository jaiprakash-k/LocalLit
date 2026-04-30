import React, { useState, useEffect } from 'react';
import useChat from '../../hooks/useChat';
import socketService from '../../services/socketService';
import { Send, Clock } from 'lucide-react';

export const ChatWindow = ({ chat, userId }) => {
  const [message, setMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const { messages, addMessage } = useChat();

  const handleSendMessage = () => {
    if (message.trim()) {
      socketService.sendMessage(chat.chat_id, userId, chat.receiver_id, message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
      {/* Chat Header */}
      <div className="border-b border-white/10 p-4 glass-card-light">
        <h3 className="font-semibold text-lg text-white">
          {chat.book?.title} - {chat.receiver_id === userId ? chat.sender?.name : chat.receiver?.name}
        </h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg backdrop-blur-md ${
                msg.sender_id === userId
                  ? 'bg-emerald-500/30 text-white border border-emerald-500/50'
                  : 'bg-white/10 text-gray-100 border border-white/20'
              }`}
            >
              <p className="text-sm">{msg.message_text}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(msg.sent_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 p-4 flex gap-2 glass-card-light">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
