import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import userService from '../../services/userService';
import bookService from '../../services/bookService';
import { BookOpen, ShoppingBag, RefreshCw, MessageCircle, Plus } from 'lucide-react';
import BookCardNew from '../Books/BookCardNew';
import Navbar from '../Layout/Navbar';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const booksResponse = await bookService.getBooksBySeller(user.user_id, { limit: 8 });
      const booksData = booksResponse?.data || [];
      setBooks(booksData);
      
      setStats({
        totalBooks: booksData?.length || 0,
        activeListings: booksData?.filter(b => b.status === 'available')?.length || 0,
        soldBooks: booksData?.filter(b => b.status === 'sold')?.length || 0,
        messages: 0
      });
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setStats({
        totalBooks: 0,
        activeListings: 0,
        soldBooks: 0,
        messages: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
        {/* Header */}
        <div className="px-6 py-12 border-b border-white/10">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.name}! 👋</h1>
            <p className="text-teal-200">Manage your books, orders, and exchanges</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Stats Grid */}
          {stats && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="glass-card p-6 hover:bg-white/[0.15] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Total Books</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats.totalBooks}</p>
                  </div>
                  <BookOpen className="h-12 w-12 text-emerald-500/40" />
                </div>
              </div>

              <div className="glass-card p-6 hover:bg-white/[0.15] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Active Listings</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats.activeListings}</p>
                  </div>
                  <ShoppingBag className="h-12 w-12 text-teal-500/40" />
                </div>
              </div>

              <div className="glass-card p-6 hover:bg-white/[0.15] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Sold</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats.soldBooks}</p>
                  </div>
                  <RefreshCw className="h-12 w-12 text-orange-500/40" />
                </div>
              </div>

              <div className="glass-card p-6 hover:bg-white/[0.15] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Messages</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats.messages}</p>
                  </div>
                  <MessageCircle className="h-12 w-12 text-emerald-500/40" />
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <a href="/add-book" className="glass-card p-8 hover:bg-white/[0.15] transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="flex items-center space-x-4">
                <div className="bg-emerald-500/20 p-4 rounded-xl group-hover:bg-emerald-500/30 transition-colors duration-300">
                  <Plus className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Add New Book</h3>
                  <p className="text-gray-400 text-sm">List a book for sale or exchange</p>
                </div>
              </div>
            </a>

            <a href="/chat" className="glass-card p-8 hover:bg-white/[0.15] transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="flex items-center space-x-4">
                <div className="bg-teal-500/20 p-4 rounded-xl group-hover:bg-teal-500/30 transition-colors duration-300">
                  <MessageCircle className="h-6 w-6 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Messages</h3>
                  <p className="text-gray-400 text-sm">Chat with buyers and sellers</p>
                </div>
              </div>
            </a>
          </div>

          {/* Your Books Section */}
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Your Books</h2>
              <p className="text-gray-400">Manage and track your listings</p>
            </div>

            {loading ? (
              <div className="glass-card p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                <p className="text-gray-300">Loading your books...</p>
              </div>
            ) : books.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {books.map(book => (
                  <BookCardNew key={book.book_id} book={book} />
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <BookOpen className="h-16 w-16 text-gray-500/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No books listed yet</h3>
                <p className="text-gray-400 mb-6">Start by adding your first book to the marketplace!</p>
                <a href="/add-book" className="btn-primary inline-block">
                  + Add Your First Book
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
