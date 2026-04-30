import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, MessageSquare, Bell, User, LogOut, BookOpen, Plus, ChevronDown, Compass, ShoppingCart } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import NotificationDrawer from './NotificationDrawer';
import CartDrawer from './CartDrawer';

/**
 * Navbar — Librarian Luxe
 * Slim persistent top bar: Logo left, search center, icon actions right
 */
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };
    updateCartCount();
    window.addEventListener('cartUpdate', updateCartCount);
    window.addEventListener('storage', updateCartCount);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('cartUpdate', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const unreadCount = 2; // mock count

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(255, 252, 245, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '0.5px solid rgba(122, 79, 30, 0.12)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">

          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
            onClick={() => navigate('/')}
          >
            <BookOpen className="h-6 w-6" style={{ color: '#7A4F1E' }} />
            <h1
              className="text-xl font-bold tracking-tight"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: '#7A4F1E',
              }}
            >
              LocalLit
            </h1>
          </div>

          {/* Center: Search Bar (desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#8C7B6A' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, authors..."
                style={{
                  background: 'rgba(122, 79, 30, 0.04)',
                  border: '1px solid rgba(122, 79, 30, 0.12)',
                  color: '#2C2417',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '14px',
                }}
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none transition-all"
                onFocus={(e) => {
                  e.target.style.borderColor = '#2A6B5C';
                  e.target.style.boxShadow = '0 0 0 3px rgba(42, 107, 92, 0.08)';
                  e.target.style.background = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(122, 79, 30, 0.12)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(122, 79, 30, 0.04)';
                }}
              />
            </div>
          </form>

          {/* Right: Icon Actions */}
          <div className="flex items-center gap-1">
            {isAuthenticated ? (
              <>
                {/* Explore */}
                <button
                  onClick={() => navigate('/explore')}
                  className="hidden sm:flex p-2 rounded-lg transition-colors relative"
                  style={{ color: location.pathname === '/explore' ? '#7A4F1E' : '#8C7B6A' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(122, 79, 30, 0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  title="Explore Collections"
                >
                  <Compass className="h-5 w-5" />
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => navigate('/wishlist')}
                  className="hidden sm:flex p-2 rounded-lg transition-colors relative"
                  style={{ color: location.pathname === '/wishlist' ? '#7A4F1E' : '#8C7B6A' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(122, 79, 30, 0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  title="Wishlist"
                >
                  <Heart className="h-5 w-5" />
                </button>

                {/* Cart */}
                <button
                  onClick={() => setShowCart(true)}
                  className="p-2 rounded-lg transition-colors relative"
                  style={{ color: showCart ? '#7A4F1E' : '#8C7B6A' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(122, 79, 30, 0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  title="Shopping Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ background: '#7A4F1E' }}
                    >
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Chat */}
                <button
                  onClick={() => navigate('/chat')}
                  className="hidden sm:flex p-2 rounded-lg transition-colors relative"
                  style={{ color: location.pathname === '/chat' ? '#7A4F1E' : '#8C7B6A' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(122, 79, 30, 0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  title="Messages"
                >
                  <MessageSquare className="h-5 w-5" />
                </button>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-lg transition-colors relative"
                    style={{ color: showNotifications ? '#7A4F1E' : '#8C7B6A' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(122, 79, 30, 0.06)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    title="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
                        style={{ background: '#C44B2B' }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Drawer Component replacing Dropdown */}
                  <NotificationDrawer 
                    isOpen={showNotifications} 
                    onClose={() => setShowNotifications(false)} 
                  />
                </div>

                {/* Add Book (quick action) */}
                <button
                  onClick={() => navigate('/add-book')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ml-1"
                  style={{
                    background: '#2A6B5C',
                    color: 'white',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#205549'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#2A6B5C'; }}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden lg:inline">List Book</span>
                </button>

                {/* Avatar Dropdown */}
                <div className="relative ml-1" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg transition-colors"
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(122, 79, 30, 0.06)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold"
                      style={{
                        background: 'linear-gradient(135deg, #7A4F1E, #C4893A)',
                        color: 'white',
                      }}
                    >
                      {(user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 hidden sm:block" style={{ color: '#8C7B6A' }} />
                  </button>

                  {showDropdown && (
                    <div
                      className="absolute right-0 mt-2 w-52 rounded-lg overflow-hidden animate-fadeIn"
                      style={{
                        background: '#FFFCF5',
                        border: '0.5px solid rgba(122, 79, 30, 0.12)',
                        boxShadow: '0 8px 24px rgba(122, 79, 30, 0.12)',
                      }}
                    >
                      <div className="px-4 py-3" style={{ borderBottom: '0.5px solid rgba(122, 79, 30, 0.08)' }}>
                        <p className="text-sm font-semibold" style={{ color: '#2C2417' }}>{user?.name || 'User'}</p>
                        <p className="text-xs" style={{ color: '#8C7B6A' }}>{user?.email || ''}</p>
                      </div>
                      <div className="py-1">
                        {[
                          { label: 'My Profile', path: '/profile', icon: User },
                          { label: 'My Requests', path: '/requests', icon: MessageSquare },
                          { label: 'Browse Books', path: '/browse', icon: BookOpen },
                        ].map(({ label, path, icon: Icon }) => (
                          <button
                            key={path}
                            onClick={() => { navigate(path); setShowDropdown(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                            style={{ color: '#2C2417' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(122, 79, 30, 0.04)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          >
                            <Icon className="h-4 w-4" style={{ color: '#8C7B6A' }} />
                            {label}
                          </button>
                        ))}
                      </div>
                      <div style={{ borderTop: '0.5px solid rgba(122, 79, 30, 0.08)' }}>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                          style={{ color: '#C44B2B' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(196, 75, 43, 0.04)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/explore')}
                  className="hidden sm:flex px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
                  style={{ color: '#8C7B6A' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#7A4F1E'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#8C7B6A'; }}
                >
                  Explore
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
                  style={{ color: '#7A4F1E' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(122, 79, 30, 0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors text-white"
                  style={{ background: '#2A6B5C' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#205549'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#2A6B5C'; }}
                >
                  Join Free
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
    </nav>
  );
};

export default Navbar;
