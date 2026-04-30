import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search } from 'lucide-react';

export const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/marketplace?search=${searchQuery}`);
    }
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-emerald-900/50 to-slate-900 border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <BookOpen className="text-emerald-400" size={32} />
          <h1 className="text-2xl font-bold text-white">BookExchange</h1>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books..."
              className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-2.5 text-emerald-400 hover:text-emerald-300"
            >
              <Search size={20} />
            </button>
          </div>
        </form>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/chat')}
            className="px-4 py-2 text-teal-300 hover:text-teal-200 font-semibold transition-colors"
          >
            Messages
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all"
          >
            Profile
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
