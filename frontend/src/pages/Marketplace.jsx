import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import BookCardNew from '../components/Books/BookCardNew';
import bookService from '../services/bookService';

export const Marketplace = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ filters, setFilters] = useState({
    search: '',
    category_id: '',
    condition: '',
    status: 'available'
  });

  useEffect(() => {
    loadBooks();
  }, [filters]);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const response = await bookService.getAllBooks(filters);
      setBooks(response.data || []);
    } catch (error) {
      console.error('Failed to load books:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
      <Navbar />
      
      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-3">
              Discover Your Next <span className="gradient-text">Great Read</span>
            </h1>
            <p className="text-gray-400">Browse thousands of books from our community</p>
          </div>

          {/* Filters */}
          <div className="glass-card p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="input-field pl-10"
                />
              </div>

              {/* Category */}
              <select
                value={filters.category_id}
                onChange={(e) => setFilters({...filters, category_id: e.target.value})}
                className="input-field"
              >
                <option value="">All Categories</option>
                <option value="1">Fiction</option>
                <option value="2">Non-Fiction</option>
                <option value="3">Science</option>
                <option value="4">History</option>
                <option value="5">Technology</option>
              </select>

              {/* Condition */}
              <select
                value={filters.condition}
                onChange={(e) => setFilters({...filters, condition: e.target.value})}
                className="input-field"
              >
                <option value="">All Conditions</option>
                <option value="new">New</option>
                <option value="like_new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>

              {/* Status */}
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="input-field"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="exchanged">Exchanged</option>
              </select>
            </div>
          </div>

          {/* Books Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading amazing books...</p>
              </div>
            </div>
          ) : books.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <h3 className="text-2xl font-bold mb-2">No books found</h3>
              <p className="text-gray-400">Try adjusting your filters or check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {books.map(book => (
                <BookCardNew key={book.book_id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
