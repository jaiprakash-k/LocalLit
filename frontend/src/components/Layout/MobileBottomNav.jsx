import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Search, PlusCircle, Inbox, User } from 'lucide-react';

/**
 * Mobile Bottom Navigation Bar — Librarian Luxe
 * Fixed bottom bar on mobile with 5 icons: Home, Browse, Add, Requests, Profile
 */
const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Search, label: 'Browse', path: '/browse' },
    { icon: PlusCircle, label: 'Add', path: '/add-book', isCenter: true },
    { icon: Inbox, label: 'Requests', path: '/requests' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: 'rgba(255, 252, 245, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '0.5px solid rgba(122, 79, 30, 0.12)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-center justify-around px-2 h-14">
        {navItems.map(({ icon: Icon, label, path, isCenter }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg transition-all"
              style={{
                color: active ? '#7A4F1E' : '#8C7B6A',
                minWidth: '56px',
              }}
            >
              {isCenter ? (
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full -mt-4 shadow-md"
                  style={{
                    background: '#2A6B5C',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(42, 107, 92, 0.3)',
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
              ) : (
                <Icon className="h-5 w-5" />
              )}
              <span
                className="text-[10px] font-medium"
                style={{
                  color: active ? '#7A4F1E' : '#8C7B6A',
                  marginTop: isCenter ? '2px' : '0px',
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
