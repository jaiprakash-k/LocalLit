import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, DollarSign } from 'lucide-react';

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card p-0 overflow-hidden card-hover cursor-pointer group"
         onClick={() => navigate(`/book/${book.book_id}`)}>
      {/* Book Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={book.images?.[0]?.image_url || 'https://via.placeholder.com/300x400?text=No+Image'}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Condition Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full capitalize">
            {book.condition}
          </span>
        </div>
        {/* Price Tag */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span className="text-lg font-bold text-emerald-600">₹{book.price}</span>
          </div>
        </div>
      </div>

      {/* Book Details */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-emerald-400 transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-gray-400 mb-3">{book.author}</p>
        
        {/* Seller Info */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <span className="text-xs text-gray-500">by {book.seller?.name || 'Unknown'}</span>
          <button className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium">
            <Eye className="h-4 w-4" />
            <span>View</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
