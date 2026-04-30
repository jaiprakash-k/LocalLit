import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, BookOpen, MessageSquare, Star, Heart } from 'lucide-react';

/**
 * NotificationDrawer — Librarian Luxe
 * Slide-over drawer for notifications from the right side.
 */
const NotificationDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Mock notifications since there's no backend endpoint for this right now
  const notifications = [
    {
      id: 1,
      type: 'request',
      icon: BookOpen,
      iconColor: '#2A6B5C',
      title: 'New Exchange Request',
      message: 'Alex wants to exchange for "The Alchemist".',
      time: '2 hours ago',
      unread: true,
      link: '/requests'
    },
    {
      id: 2,
      type: 'message',
      icon: MessageSquare,
      iconColor: '#B8860B',
      title: 'New Message',
      message: 'Sarah sent you a message regarding "1984".',
      time: '5 hours ago',
      unread: true,
      link: '/chat'
    },
    {
      id: 3,
      type: 'review',
      icon: Star,
      iconColor: '#C44B2B',
      title: 'New Review',
      message: 'You received a 5-star review from Michael.',
      time: '1 day ago',
      unread: false,
      link: '/profile'
    },
    {
      id: 4,
      type: 'wishlist',
      icon: Heart,
      iconColor: '#7A4F1E',
      title: 'Wishlist Alert',
      message: 'A book on your wishlist ("Dune") is now available.',
      time: '2 days ago',
      unread: false,
      link: '/wishlist'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div 
        className="relative w-full max-w-sm h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out z-10 animate-slideInRight"
        style={{ background: '#FFFCF5', borderLeft: '0.5px solid rgba(122, 79, 30, 0.12)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '0.5px solid rgba(122, 79, 30, 0.1)' }}>
          <h2 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417' }}>Notifications</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full transition-colors"
            style={{ color: '#8C7B6A' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(122, 79, 30, 0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto w-full" style={{ scrollbarWidth: 'thin' }}>
          {notifications.length > 0 ? (
            <div className="divide-y" style={{ borderColor: 'rgba(122, 79, 30, 0.08)' }}>
              {notifications.map((notif) => {
                const Icon = notif.icon;
                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      onClose();
                      navigate(notif.link);
                    }}
                    className="px-6 py-4 cursor-pointer transition-colors hover:bg-black/5"
                    style={{ background: notif.unread ? 'rgba(42, 107, 92, 0.03)' : 'transparent' }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(122, 79, 30, 0.05)' }}>
                        <Icon className="h-5 w-5" style={{ color: notif.iconColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm font-semibold truncate ${notif.unread ? 'text-gray-900' : 'text-gray-700'}`} style={{ color: '#2C2417' }}>
                            {notif.title}
                          </p>
                          <p className="text-xs shrink-0 ml-2" style={{ color: '#8C7B6A' }}>{notif.time}</p>
                        </div>
                        <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: '#6A5C4D' }}>
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center px-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(122, 79, 30, 0.05)' }}>
                <span className="text-2xl">🤫</span>
              </div>
              <p className="font-semibold text-lg mb-1" style={{ color: '#2C2417', fontFamily: "'Playfair Display', serif" }}>All Caught Up</p>
              <p className="text-sm" style={{ color: '#8C7B6A' }}>You have no new notifications right now.</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 bg-white/50 backdrop-blur-sm" style={{ borderTop: '0.5px solid rgba(122, 79, 30, 0.1)' }}>
            <button className="w-full py-2.5 text-sm font-semibold rounded-lg transition-colors"
                style={{ color: '#7A4F1E', background: 'rgba(122, 79, 30, 0.05)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(122, 79, 30, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(122, 79, 30, 0.05)'}>
              Mark all as read
            </button>
          </div>
        )}
      </div>
{/* Added slideInRight animation in style block for inline handling */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
};

export default NotificationDrawer;
