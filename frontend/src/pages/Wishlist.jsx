import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, BookOpen, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import useAuth from '../hooks/useAuth';
import bookService from '../services/bookService';
import { getBookCoverUrl } from '../utils/imageUtils';
import { formatPrice } from '../utils/currency';

/**
 * Wishlist — localStorage-based (no backend wishlist API)
 * Fetches book details for each saved ID
 */
const Wishlist = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadWishlist(); }, []);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const ids = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (ids.length === 0) { setWishlistBooks([]); setLoading(false); return; }

      // Fetch all books and filter by wishlist IDs
      const response = await bookService.getAllBooks();
      const allBooks = response?.books || response?.data || response || [];
      const bookList = Array.isArray(allBooks) ? allBooks : [];
      const saved = bookList.filter(b => ids.includes(b.id || b.book_id));
      setWishlistBooks(saved);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
      setWishlistBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (bookId) => {
    const ids = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const updated = ids.filter(id => id !== bookId);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    setWishlistBooks(prev => prev.filter(b => (b.id || b.book_id) !== bookId));
  };

  const handleRemoveAll = () => {
    localStorage.setItem('wishlist', JSON.stringify([]));
    setWishlistBooks([]);
  };

  if (loading) return (<div style={{ background: '#FAF6EE', minHeight: '100vh' }}><Navbar /><LoadingSpinner message="Loading wishlist..." /></div>);

  return (
    <div style={{ background: '#FAF6EE', minHeight: '100vh' }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417', fontWeight: '700' }}>Wishlist</h1>
            <p className="text-sm mt-1" style={{ color: '#8C7B6A' }}>{wishlistBooks.length} book{wishlistBooks.length !== 1 ? 's' : ''} saved</p>
          </div>
          {wishlistBooks.length > 0 && (
            <button onClick={handleRemoveAll} className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium"
              style={{ color: '#C44B2B', border: '1px solid rgba(196,75,43,0.2)' }}>
              <Trash2 className="h-4 w-4" /> Remove All
            </button>
          )}
        </div>

        {wishlistBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {wishlistBooks.map((book) => {
              const bookId = book.id || book.book_id;
              return (
                <div key={bookId} className="rounded-lg overflow-hidden transition-all cursor-pointer"
                  style={{ background: '#FFFCF5', border: '0.5px solid rgba(122,79,30,0.1)', boxShadow: '0 1px 3px rgba(122,79,30,0.06)' }}
                  onClick={() => navigate(`/book-details/${bookId}`)}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(122,79,30,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(122,79,30,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div className="relative h-48" style={{ background: '#F5EFE3' }}>
                    <img src={getBookCoverUrl(book.image_url || book.images?.[0]?.image_url, 300, 400)} alt={book.title} className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = getBookCoverUrl(null, 300, 400); }} />
                    <button onClick={(e) => { e.stopPropagation(); handleRemove(bookId); }}
                      className="absolute top-3 right-3 p-2 rounded-full transition-colors"
                      style={{ background: 'rgba(255,252,245,0.9)', color: '#C44B2B' }}>
                      <Heart className="h-4 w-4 fill-current" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold line-clamp-2 mb-1" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417' }}>{book.title}</h3>
                    <p className="text-sm mb-2" style={{ color: '#8C7B6A' }}>by {book.author || 'Unknown'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: '#B3A394' }}>{book.owner_city || book.city || ''}{(book.owner_state || book.state) ? `, ${book.owner_state || book.state}` : ''}</span>
                      {book.type === 'sell' && book.price ? (
                        <span className="font-bold text-sm" style={{ color: '#7A4F1E', fontFamily: "'JetBrains Mono', monospace" }}>{formatPrice(book.price)}</span>
                      ) : (
                        <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: 'rgba(42,107,92,0.08)', color: '#2A6B5C' }}>Lend</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(122,79,30,0.06)' }}>
              <BookOpen className="h-12 w-12" style={{ color: '#B3A394' }} />
            </div>
            <h2 className="text-2xl mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417', fontWeight: '700' }}>Your bookshelf awaits</h2>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: '#8C7B6A' }}>Start browsing our collection and save books you'd love to read. They'll appear here for easy access.</p>
            <button onClick={() => navigate('/browse')} className="btn-primary inline-flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Start Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
