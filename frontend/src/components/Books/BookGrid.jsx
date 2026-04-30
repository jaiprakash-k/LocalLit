import React, { useState, useEffect } from 'react';
import bookService from '../../services/bookService';
import { Star, BookOpen } from 'lucide-react';
import { formatPrice } from '../../utils/currency';

export const BookGrid = ({ filters = {} }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 12 });

  useEffect(() => {
    loadBooks();
  }, [filters, pagination]);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const response = await bookService.getAllBooks({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });
      setBooks(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to load books:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading books...</p>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No books found</h3>
        <p className="text-gray-400">Try adjusting your filters or check back later!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map(book => (
          <div key={book.book_id} className="glass-card overflow-hidden cursor-pointer card-hover">
            <img
              src={book.images?.[0]?.image_url || 'https://via.placeholder.com/200x250?text=No+Image'}
              alt={book.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-white line-clamp-2">{book.title}</h3>
              <p className="text-sm text-gray-300 mb-2">{book.author}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-emerald-400">{formatPrice(book.price)}</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-200 px-2 py-1 rounded border border-emerald-500/30">{book.condition}</span>
              </div>
              <p className="text-xs text-gray-400">{book.seller?.name || 'Unknown seller'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: pagination.pages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
            className={`px-3 py-2 rounded transition-all ${
              pagination.page === i + 1
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookGrid;
