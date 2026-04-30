import React, { useState, useEffect } from 'react';
import bookService from '../../services/bookService';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { GlassCard, PrimaryButton } from '../Common/ThemeComponents';
import { getBookCoverUrl } from '../../utils/imageUtils';
import { formatPrice } from '../../utils/currency';

export const UserBooks = ({ userId }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserBooks();
  }, [userId]);

  const loadUserBooks = async () => {
    setLoading(true);
    try {
      const response = await bookService.getBooksBySeller(userId);
      setBooks(response.data);
    } catch (error) {
      console.error('Failed to load user books:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <GlassCard className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-2"></div>
        <p className="text-gray-300">Loading books...</p>
      </GlassCard>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">My Books</h2>
        <PrimaryButton>
          <Plus className="w-5 h-5 mr-2 inline-block" />
          Add Book
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map(book => (
          <GlassCard key={book.book_id} className="overflow-hidden">
            <img
              src={getBookCoverUrl(book.images?.[0]?.image_url, 200, 250)}
              alt={book.title}
              className="w-full h-40 object-cover"
              onError={(e) => {
                e.target.src = getBookCoverUrl(null, 200, 250);
              }}
            />
            <div className="p-4">
              <h3 className="font-semibold line-clamp-2 text-white">{book.title}</h3>
              <p className="text-sm text-emerald-400 font-semibold">{formatPrice(book.price)}</p>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-3 py-2 rounded text-sm flex items-center justify-center gap-2 hover:bg-emerald-500/30 transition-colors">
                  <Edit size={16} />
                </button>
                <button className="flex-1 bg-red-500/20 border border-red-500/30 text-red-300 px-3 py-2 rounded text-sm flex items-center justify-center gap-2 hover:bg-red-500/30 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default UserBooks;
