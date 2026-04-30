import React from 'react';

/**
 * Chat Message — Librarian Luxe
 * Warm cream tones, serif accents, collapsible timestamps
 */
const ChatMessage = ({ message, isOutgoing, senderName, timestamp }) => {
  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} mb-3 group`}>
      <div className={`max-w-xs lg:max-w-sm flex flex-col ${isOutgoing ? 'items-end' : 'items-start'}`}>
        {!isOutgoing && (
          <span className="text-xs font-semibold mb-1 px-1" style={{ color: '#7A4F1E' }}>{senderName}</span>
        )}
        <div
          className={`px-4 py-2.5 rounded-xl ${isOutgoing ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
          style={isOutgoing ? {
            background: '#2A6B5C',
            color: 'white',
          } : {
            background: '#FFFCF5',
            border: '0.5px solid rgba(122, 79, 30, 0.1)',
            color: '#2C2417',
          }}
        >
          <p className="text-sm break-words leading-relaxed">{message}</p>
        </div>
        <span className="text-[10px] mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#B3A394' }}>
          {formatTime(timestamp)}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
