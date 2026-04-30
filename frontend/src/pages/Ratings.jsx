import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';
import useAuth from '../hooks/useAuth';
import reviewService from '../services/reviewService';

/**
 * Ratings — fetches from real backend
 */
const Ratings = () => {
  const { user } = useAuth();
  const [filterRole, setFilterRole] = useState('all');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { if (user) loadReviews(); }, [user]);

  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reviewService.getUserReviews(user?.id || user?.user_id);
      const revs = response?.reviews || response?.data || response || [];
      setReviews(Array.isArray(revs) ? revs : []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setError(err?.response?.data?.message || 'Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  // Compute stats from real data
  const stats = (() => {
    if (reviews.length === 0) return { average: 0, total: 0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    reviews.forEach(r => {
      const rating = Math.round(r.rating || 0);
      if (rating >= 1 && rating <= 5) breakdown[rating]++;
      sum += r.rating || 0;
    });
    return { average: (sum / reviews.length).toFixed(1), total: reviews.length, breakdown };
  })();

  const filtered = filterRole === 'all' ? reviews : reviews.filter(r => r.role === filterRole);

  const DonutChart = () => {
    if (stats.total === 0) return null;
    let cumulative = 0;
    const segments = [5, 4, 3, 2, 1].map(star => {
      const count = stats.breakdown[star];
      const pct = (count / stats.total) * 100;
      const offset = cumulative;
      cumulative += pct;
      const colors = { 5: '#2A7D4F', 4: '#B8860B', 3: '#D97652', 2: '#C44B2B', 1: '#8C7B6A' };
      return { star, pct, offset, color: colors[star] };
    });

    return (
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {segments.map(s => (
            <circle key={s.star} cx="18" cy="18" r="15.9" fill="none" strokeWidth="3"
              stroke={s.color} strokeDasharray={`${s.pct} ${100 - s.pct}`} strokeDashoffset={-s.offset} strokeLinecap="round" />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold" style={{ color: '#2C2417', fontFamily: "'Playfair Display', serif" }}>{stats.average}</span>
          <span className="text-[10px]" style={{ color: '#B3A394' }}>of 5</span>
        </div>
      </div>
    );
  };

  if (loading) return (<div style={{ background: '#FAF6EE', minHeight: '100vh' }}><Navbar /><LoadingSpinner message="Loading reviews..." /></div>);

  return (
    <div style={{ background: '#FAF6EE', minHeight: '100vh' }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl lg:text-4xl mb-6" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417', fontWeight: '700' }}>Ratings & Reviews</h1>

        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

        {reviews.length > 0 ? (
          <>
            {/* Aggregate Stats */}
            <div className="flex flex-col sm:flex-row gap-6 items-center rounded-xl p-6 mb-8"
              style={{ background: '#FFFCF5', border: '0.5px solid rgba(122,79,30,0.1)' }}>
              <DonutChart />
              <div className="flex-1">
                <p className="text-sm font-semibold mb-3" style={{ color: '#2C2417' }}>{stats.total} total reviews</p>
                {[5, 4, 3, 2, 1].map(star => (
                  <div key={star} className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-medium w-6 text-right" style={{ color: '#8C7B6A' }}>{star}★</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(122,79,30,0.06)' }}>
                      <div className="h-full rounded-full transition-all" style={{
                        width: stats.total > 0 ? `${(stats.breakdown[star] / stats.total) * 100}%` : '0%',
                        background: star >= 4 ? '#2A7D4F' : star === 3 ? '#B8860B' : '#C44B2B',
                      }} />
                    </div>
                    <span className="text-xs w-6" style={{ color: '#B3A394' }}>{stats.breakdown[star]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-0 mb-6" style={{ borderBottom: '0.5px solid rgba(122,79,30,0.12)' }}>
              {[{ key: 'all', label: 'All' }, { key: 'buyer', label: 'As Buyer' }, { key: 'lender', label: 'As Lender' }].map(tab => (
                <button key={tab.key} onClick={() => setFilterRole(tab.key)}
                  className="px-5 py-3 text-sm font-medium transition-all"
                  style={{
                    color: filterRole === tab.key ? '#7A4F1E' : '#8C7B6A',
                    borderBottom: filterRole === tab.key ? '2px solid #7A4F1E' : '2px solid transparent',
                  }}>{tab.label}</button>
              ))}
            </div>

            {/* Reviews Timeline */}
            <div className="space-y-1">
              {filtered.map((review, index) => (
                <div key={review.id || review.review_id || index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5" style={{ background: (review.rating || 0) >= 4 ? '#2A7D4F' : (review.rating || 0) === 3 ? '#B8860B' : '#C44B2B' }} />
                    {index < filtered.length - 1 && <div className="w-px flex-1 my-1" style={{ background: 'rgba(122,79,30,0.1)' }} />}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="rounded-lg p-5" style={{ background: '#FFFCF5', border: '0.5px solid rgba(122,79,30,0.1)' }}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-sm" style={{ color: '#2C2417' }}>{review.reviewer_name || review.reviewer || 'Anonymous'}</p>
                          <p className="text-xs" style={{ color: '#B3A394' }}>{review.book_title || ''}{review.created_at ? ` • ${new Date(review.created_at).toLocaleDateString()}` : ''}</p>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5" style={{ color: i < (review.rating || 0) ? '#B8860B' : '#D5CBBD', fill: i < (review.rating || 0) ? '#B8860B' : 'none' }} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: '#8C7B6A' }}>{review.text || review.review_text || review.comment || ''}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(122,79,30,0.06)' }}>
              <Star className="h-12 w-12" style={{ color: '#B3A394' }} />
            </div>
            <h2 className="text-2xl mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417', fontWeight: '700' }}>No reviews yet</h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: '#8C7B6A' }}>Reviews from your book exchanges will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ratings;
