import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Home, BookOpen, MessageCircle, User, LogOut, Sun, Moon } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';

export const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'Browse Books', path: '/marketplace' },
    { icon: BookOpen, label: 'My Books', path: '/my-books' },
    { icon: MessageCircle, label: 'Messages', path: '/chat' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-emerald-600 to-teal-600 text-white transition-all duration-300 h-screen flex flex-col`}>
      {/* Logo */}
      <div className="p-4 flex items-center justify-between">
        {isOpen && <h1 className="text-xl font-bold">BookExch</h1>}
        <button onClick={() => setIsOpen(!isOpen)} className="hover:bg-white hover:bg-opacity-20 p-2 rounded">
          <Menu size={24} />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-20 transition"
          >
            <item.icon size={24} />
            {isOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-2 border-t border-white border-opacity-20">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-20 transition"
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
          {isOpen && <span>{isDark ? 'Light' : 'Dark'}</span>}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500 transition"
        >
          <LogOut size={24} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
