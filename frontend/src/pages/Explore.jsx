import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, TrendingUp, Star, Clock, ArrowRight } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import bookService from '../services/bookService';
import { getBookCoverUrl } from '../utils/imageUtils';

/**
 * Explore Page — Librarian Luxe
 * Curated horizontal lists of books (Staff Picks, Trending, New Arrivals)
 */
const Explore = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState({
    staffPicks: [],
    trending: [],
    newArrivals: []
  });

  const spineColors = ['#7A4F1E', '#2A6B5C', '#C44B2B', '#B8860B', '#5E3B14', '#205549', '#D97652', '#462C0F'];

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      try {
        const res = await bookService.getAllBooks();
        const allBooks = Array.isArray(res?.books) ? res.books : (Array.isArray(res?.data) ? res.data : []);
        
        // Mocking collections from the single endpoint for now
        // Usually these would be distinct API calls or filtered by the backend
        const shuffled = [...allBooks].sort(() => 0.5 - Math.random());
        
        setCollections({
          staffPicks: shuffled.slice(0, 6),
          trending: [...allBooks].sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0)).slice(0, 6),
          newArrivals: [...allBooks].sort((a, b) => new Date(b.uploaded_at || b.created_at) - new Date(a.uploaded_at || a.created_at)).slice(0, 6)
        });
      } catch (err) {
        console.error('Failed to load explore collections', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const BookCarousel = ({ title, description, icon: Icon, books, color }) => {
    if (!books || books.length === 0) return null;

    return (
      <div className="mb-16">
        <div className="flex items-end justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm" style={{ background: color, color: 'white' }}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417' }}>{title}</h2>
              <p className="text-sm mt-0.5" style={{ color: '#8C7B6A' }}>{description}</p>
            </div>
          </div>
          <button onClick={() => navigate('/browse')} className="hidden sm:flex items-center gap-1.5 text-sm font-semibold transition-colors" style={{ color: color }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            See All <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto gap-6 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x" style={{ scrollbarWidth: 'none' }}>
          {books.map((book, idx) => {
            const bookId = book.id || book.book_id;
            return (
              <div
                key={bookId}
                onClick={() => navigate(`/book-details/${bookId}`)}
                className="group flex-shrink-0 w-44 sm:w-48 cursor-pointer snap-start"
              >
                <div className="relative h-64 sm:h-72 rounded-lg overflow-hidden mb-3 transition-transform duration-300"
                  style={{
                    boxShadow: '0 4px 12px rgba(122, 79, 30, 0.1)',
                    borderLeft: `4px solid ${spineColors[idx % spineColors.length]}`
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(122, 79, 30, 0.15)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(122, 79, 30, 0.1)'; }}
                >
                  <img src={getBookCoverUrl(book.image_url || book.images?.[0]?.image_url, 300, 450)} alt={book.title}
                    className="w-full h-full object-cover bg-[#F5EFE3]"
                    onError={(e) => { e.target.src = getBookCoverUrl(null, 300, 450); }} />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
                    style={{ background: 'rgba(44, 36, 23, 0.4)' }}>
                    <span className="px-4 py-2 bg-white rounded-full text-xs font-bold shadow-lg" style={{ color: '#2C2417' }}>View Details</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold line-clamp-1 mb-0.5" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417' }}>{book.title}</h3>
                  <p className="text-xs line-clamp-1 mb-1.5" style={{ color: '#8C7B6A' }}>{book.author}</p>
                  <p className="text-[10px] font-medium px-2 py-0.5 inline-block rounded" style={{ background: 'rgba(122, 79, 30, 0.06)', color: '#7A4F1E' }}>
                    {book.type === 'sell' ? `Sell • ₹${book.price}` : 'Lend'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ background: '#FAF6EE', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero Banner */}
      <div className="relative pt-16 pb-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #7A4F1E 0%, #5E3B14 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <Compass className="h-12 w-12 mx-auto mb-4 opacity-80 text-white" />
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}>
            Explore Collections
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Curated shelves and trending titles from readers in your community. Discover your next great read.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10" style={{ border: '0.5px solid rgba(122, 79, 30, 0.1)' }}>
          {loading ? (
            <div className="py-20"><LoadingSpinner message="Curating collections..." /></div>
          ) : (
            <>
              <BookCarousel title="Staff Picks" description="Hand-selected by our editorial team" icon={Star} books={collections.staffPicks} color="#B8860B" />
              <BookCarousel title="Trending Now" description="The most popular books this week" icon={TrendingUp} books={collections.trending} color="#C44B2B" />
              <BookCarousel title="New Arrivals" description="Fresh additions from your community" icon={Clock} books={collections.newArrivals} color="#2A6B5C" />
            </>
          )}

          {!loading && collections.staffPicks.length === 0 && (
             <div className="text-center py-20">
               <p className="text-lg" style={{ color: '#8C7B6A' }}>No collections available at the moment.</p>
               <button onClick={() => navigate('/browse')} className="mt-4 btn-primary">Browse All Books</button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
