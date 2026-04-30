import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Heart, MapPin } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { getBookCoverUrl } from '../../utils/imageUtils';
import { formatPrice } from '../../utils/currency';

/**
 * Book Card — Librarian Luxe
 * Vertical card with colored left-border spine accent based on condition
 */
const getSpineColor = (condition) => {
  const c = (condition || '').toLowerCase();
  if (c === 'new' || c === 'like_new' || c === 'excellent') return '#2A7D4F';
  if (c === 'good') return '#B8860B';
  if (c === 'fair') return '#D97652';
  if (c === 'poor') return '#C44B2B';
  return '#8C7B6A';
};

const getConditionBadge = (condition) => {
  const c = (condition || '').toLowerCase();
  const map = {
    new: { bg: 'rgba(42, 125, 79, 0.1)', color: '#2A7D4F', border: 'rgba(42, 125, 79, 0.2)' },
    like_new: { bg: 'rgba(42, 125, 79, 0.1)', color: '#2A7D4F', border: 'rgba(42, 125, 79, 0.2)' },
    excellent: { bg: 'rgba(42, 125, 79, 0.1)', color: '#2A7D4F', border: 'rgba(42, 125, 79, 0.2)' },
    good: { bg: 'rgba(184, 134, 11, 0.1)', color: '#B8860B', border: 'rgba(184, 134, 11, 0.2)' },
    fair: { bg: 'rgba(217, 118, 82, 0.1)', color: '#D97652', border: 'rgba(217, 118, 82, 0.2)' },
    poor: { bg: 'rgba(196, 75, 43, 0.1)', color: '#C44B2B', border: 'rgba(196, 75, 43, 0.2)' },
  };
  return map[c] || { bg: 'rgba(140, 123, 106, 0.1)', color: '#8C7B6A', border: 'rgba(140, 123, 106, 0.2)' };
};

export const BookCard = ({ book, onAddWishlist, isInWishlist }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleViewDetails = () => {
    navigate(`/book-details/${book.id || book.book_id}`);
  };

  const handleAddWishlist = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    if (onAddWishlist) onAddWishlist(book.id || book.book_id);
  };

  const spineColor = getSpineColor(book.condition);
  const badge = getConditionBadge(book.condition);

  return (
    <div
      className="rounded-lg overflow-hidden transition-all cursor-pointer"
      style={{
        background: '#FFFCF5',
        border: '0.5px solid rgba(122, 79, 30, 0.1)',
        borderLeft: `4px solid ${spineColor}`,
        boxShadow: '0 1px 3px rgba(122, 79, 30, 0.06)',
      }}
      onClick={handleViewDetails}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(122, 79, 30, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(122, 79, 30, 0.06)';
      }}
    >
      {/* Book Cover */}
      <div className="relative h-52 overflow-hidden" style={{ background: '#F5EFE3' }}>
        <img
          src={getBookCoverUrl(book.image_url || book.images?.[0]?.image_url, 300, 400)}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => { e.target.src = getBookCoverUrl(null, 300, 400); }}
        />
        {/* Condition Badge */}
        {book.condition && (
          <div className="absolute top-3 right-3">
            <span
              className="px-2.5 py-1 text-xs font-semibold rounded capitalize"
              style={{
                background: badge.bg,
                color: badge.color,
                border: `1px solid ${badge.border}`,
              }}
            >
              {book.condition}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3
          className="text-base font-bold line-clamp-2 mb-1"
          style={{ color: '#2C2417', fontFamily: "'Playfair Display', serif" }}
        >
          {book.title}
        </h3>
        <p className="text-sm mb-2" style={{ color: '#8C7B6A' }}>
          by {book.author || 'Unknown Author'}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs mb-3" style={{ color: '#B3A394' }}>
          <MapPin className="h-3.5 w-3.5" style={{ color: '#8C7B6A' }} />
          <span>{book.owner_city || book.city}, {book.owner_state || book.state}</span>
        </div>

        {/* Price */}
        {book.type === 'sell' && book.price && (
          <p className="text-base font-bold mb-3" style={{ color: '#7A4F1E', fontFamily: "'JetBrains Mono', monospace" }}>
            {formatPrice(book.price)}
          </p>
        )}
        {book.type === 'lend' && (
          <p className="text-xs font-medium mb-3 px-2 py-1 rounded inline-block" style={{ background: 'rgba(42, 107, 92, 0.08)', color: '#2A6B5C' }}>
            Available to Lend
          </p>
        )}

        {/* Divider */}
        <div className="mb-3" style={{ borderTop: '0.5px solid rgba(122, 79, 30, 0.08)' }} />

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleViewDetails(); }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-all"
            style={{ background: '#2A6B5C', color: 'white' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#205549'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#2A6B5C'; }}
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </button>
          <button
            onClick={handleAddWishlist}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-all"
            style={{
              background: isInWishlist ? 'rgba(196, 75, 43, 0.08)' : 'transparent',
              color: isInWishlist ? '#C44B2B' : '#8C7B6A',
              border: `1px solid ${isInWishlist ? 'rgba(196, 75, 43, 0.2)' : 'rgba(122, 79, 30, 0.12)'}`,
            }}
          >
            <Heart className={`h-3.5 w-3.5 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
