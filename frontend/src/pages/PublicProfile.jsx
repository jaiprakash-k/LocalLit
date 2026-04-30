import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, BookOpen, ArrowUpRight } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';
import userService from '../services/userService';
import bookService from '../services/bookService';
import reviewService from '../services/reviewService';
import { getAvatarUrl } from '../utils/imageUtils';

/**
 * Public Profile Page — Librarian Luxe
 * Read-only view of a user's listed books and reviews
 */
const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('books');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [profileData, setProfileData] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ books_listed: 0, exchanges: 0, rating: 0 });

  useEffect(() => {
    if (userId) loadPublicProfile();
  }, [userId]);

  const loadPublicProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch user details, books, and reviews in parallel
      const [profileRes, booksRes, reviewsRes] = await Promise.all([
        userService.getUserById(userId).catch(() => null),
        bookService.getBooksBySeller(userId).catch(() => null),
        reviewService.getUserReviews(userId).catch(() => null)
      ]);

      if (!profileRes) {
        throw new Error('User not found');
      }

      const profile = profileRes?.user || profileRes?.data || profileRes;
      setProfileData(profile);

      const books = booksRes?.books || booksRes?.data || booksRes || [];
      setUserBooks(Array.isArray(books) ? books : []);

      const r = reviewsRes?.reviews || reviewsRes?.data || reviewsRes || [];
      const validReviews = Array.isArray(r) ? r : [];
      setReviews(validReviews);

      // Calculate stats based on fetched data
      // For a public profile without a dedicated stats endpoint, we infer from arrays
      const avgRating = validReviews.length > 0 
        ? validReviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / validReviews.length 
        : 0;

      // Some backends might include stats in the user object
      setStats({
        books_listed: profile.books_listed || Array.isArray(books) ? books.length : 0,
        exchanges: profile.exchanges_completed || 0, // Fallback to 0 if not provided
        rating: profile.average_rating || avgRating
      });

    } catch (err) {
      console.error('Public profile load error:', err);
      setError(err.message || 'Failed to load user profile. They might have deleted their account.');
    } finally {
      setLoading(false);
    }
  };

  const condColor = (c) => {
    const m = { excellent: '#2A7D4F', good: '#B8860B', fair: '#D97652', poor: '#C44B2B' };
    return m[(c || '').toLowerCase()] || '#8C7B6A';
  };

  const tabs = [
    { key: 'books', label: `Collection (${userBooks.length})` },
    { key: 'reviews', label: `Reviews (${reviews.length})` }
  ];

  if (loading) {
    return (
      <div style={{ background: '#FAF6EE', minHeight: '100vh' }}>
        <Navbar />
        <LoadingSpinner message="Loading profile..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#FAF6EE', minHeight: '100vh' }}>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4" style={{ color: '#C44B2B', opacity: 0.5 }} />
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417' }}>Profile Unavailable</h2>
          <p style={{ color: '#8C7B6A' }}>{error}</p>
          <button onClick={() => navigate('/browse')} className="mt-6 btn-primary">Back to Browse</button>
        </div>
      </div>
    );
  }

  const p = profileData || {};

  return (
    <div style={{ background: '#FAF6EE', minHeight: '100vh' }}>
      <Navbar />
      
      <div className="relative">
        {/* Banner */}
        <div className="h-36 lg:h-44" style={{ background: 'linear-gradient(135deg, #7A4F1E, #C4893A)' }} />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-14 mb-6">
            <img 
              src={getAvatarUrl(p.avatar_url || p.profile_image, 150)} 
              alt={p.name}
              className="w-28 h-28 rounded-xl object-cover" 
              style={{ border: '4px solid #FAF6EE', boxShadow: '0 4px 12px rgba(122,79,30,0.15)' }}
              onError={(e) => { e.target.src = getAvatarUrl(null, 150); }} 
            />
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417', fontWeight: '700' }}>
                {p.name || 'Library Member'}
              </h1>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap" style={{ color: '#8C7B6A' }}>
                {(p.city || p.location) && (
                  <>
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{p.city}{p.state ? `, ${p.state}` : ''}{!p.city && p.location ? p.location : ''}</span>
                    <span className="mx-2">•</span>
                  </>
                )}
                <span className="text-sm">
                  Joined {p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'recently'}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Books Listed', value: stats.books_listed },
              { label: 'Exchanges', value: stats.exchanges },
              { label: 'Avg Rating', value: stats.rating ? Number(stats.rating).toFixed(1) : '—', suffix: stats.rating ? '★' : '' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg p-4 text-center" style={{ background: '#FFFCF5', border: '0.5px solid rgba(122,79,30,0.1)' }}>
                <p className="text-2xl lg:text-3xl font-bold" style={{ color: '#7A4F1E', fontFamily: "'Playfair Display', serif" }}>
                  {stat.value}{stat.suffix || ''}
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: '#B3A394' }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-0" style={{ borderBottom: '0.5px solid rgba(122,79,30,0.12)' }}>
            {tabs.map(tab => (
              <button 
                key={tab.key} 
                onClick={() => setActiveTab(tab.key)}
                className="px-5 py-3 text-sm font-medium transition-all relative"
                style={{ 
                  color: activeTab === tab.key ? '#7A4F1E' : '#8C7B6A', 
                  borderBottom: activeTab === tab.key ? '2px solid #7A4F1E' : '2px solid transparent' 
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="py-6">
            
            {/* Books Tab */}
            {activeTab === 'books' && (
              <div>
                <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417' }}>
                  {p.name ? `${p.name.split(' ')[0]}'s Collection` : 'Collection'}
                </h2>
                
                {userBooks.length > 0 ? (
                  <div className="rounded-lg overflow-hidden" style={{ background: '#FFFCF5', border: '0.5px solid rgba(122,79,30,0.1)' }}>
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: '0.5px solid rgba(122,79,30,0.1)' }}>
                          {['Title', 'Author', 'Condition', 'Type', 'Price', ''].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#B3A394' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {userBooks.map(book => (
                          <tr 
                            key={book.id || book.book_id} 
                            className="transition-colors cursor-pointer" 
                            style={{ borderBottom: '0.5px solid rgba(122,79,30,0.06)' }}
                            onClick={() => navigate(`/book-details/${book.id || book.book_id}`)}
                            onMouseEnter={(e) => e.currentTarget.style.background='rgba(122,79,30,0.02)'} 
                            onMouseLeave={(e) => e.currentTarget.style.background='transparent'}
                          >
                            <td className="px-4 py-3 font-semibold" style={{ color: '#2C2417', fontFamily: "'Playfair Display', serif" }}>{book.title}</td>
                            <td className="px-4 py-3" style={{ color: '#8C7B6A' }}>{book.author}</td>
                            <td className="px-4 py-3">
                              <span className="text-xs font-semibold capitalize" style={{ color: condColor(book.condition) }}>{book.condition}</span>
                            </td>
                            <td className="px-4 py-3 capitalize" style={{ color: '#8C7B6A' }}>{book.type}</td>
                            <td className="px-4 py-3" style={{ color: '#7A4F1E', fontFamily: "'JetBrains Mono', monospace", fontWeight: '600' }}>
                              {book.type === 'sell' && book.price ? `₹${book.price}` : '—'}
                            </td>
                            <td className="px-4 py-3"><ArrowUpRight className="h-4 w-4" style={{ color: '#8C7B6A' }} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 rounded-lg" style={{ background: '#FFFCF5', border: '0.5px solid rgba(122,79,30,0.1)' }}>
                    <BookOpen className="h-10 w-10 mx-auto mb-3" style={{ color: '#B3A394' }} />
                    <p className="text-sm font-medium" style={{ color: '#2C2417' }}>No books listed</p>
                    <p className="text-xs mt-1" style={{ color: '#8C7B6A' }}>This user hasn't added any books to their collection yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417' }}>Community Reviews</h2>
                
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map(r => (
                      <div key={r.id || r.review_id} className="rounded-lg p-5" style={{ background: '#FFFCF5', border: '0.5px solid rgba(122,79,30,0.1)' }}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold" style={{ color: '#2C2417' }}>{r.reviewer_name || r.reviewer || 'Anonymous Member'}</p>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className="h-4 w-4" 
                                style={{ 
                                  color: i < (r.rating || 0) ? '#B8860B' : '#D5CBBD', 
                                  fill: i < (r.rating || 0) ? '#B8860B' : 'none' 
                                }} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm" style={{ color: '#8C7B6A' }}>{r.text || r.review_text || r.comment || ''}</p>
                        <p className="text-xs mt-2" style={{ color: '#B3A394' }}>{r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 rounded-lg" style={{ background: '#FFFCF5', border: '0.5px solid rgba(122,79,30,0.1)' }}>
                    <Star className="h-10 w-10 mx-auto mb-3" style={{ color: '#B3A394' }} />
                    <p className="text-sm font-medium" style={{ color: '#2C2417' }}>No reviews yet</p>
                    <p className="text-xs mt-1" style={{ color: '#8C7B6A' }}>This user hasn't received any reviews.</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
