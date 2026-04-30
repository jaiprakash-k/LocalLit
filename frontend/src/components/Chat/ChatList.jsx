import React from 'react';
import { ChevronRight } from 'lucide-react';

export const ChatList = ({ chats, currentChat, onSelectChat }) => {
  return (
    <div className="w-full overflow-y-auto">
      {chats && chats.map((chat) => (
        <div
          key={chat.chat_id}
          onClick={() => onSelectChat(chat)}
          className={`p-4 border-b border-white/10 cursor-pointer transition-all duration-300 hover:bg-white/10 group ${
            currentChat?.chat_id === chat.chat_id ? 'bg-emerald-500/20 border-b border-emerald-500/50' : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-white group-hover:text-emerald-400 transition-colors truncate">
                {chat.book?.title || 'Conversation'}
              </h3>
              <p className="text-xs text-gray-400 mt-1 truncate">
                {chat.receiver?.name || chat.sender?.name || 'Unknown'}
              </p>
              {chat.last_message && (
                <p className="text-xs text-gray-500 mt-1 truncate">{chat.last_message?.content}</p>
              )}
            </div>
            {currentChat?.chat_id === chat.chat_id && (
              <ChevronRight className="h-4 w-4 text-emerald-400 ml-2 flex-shrink-0" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
