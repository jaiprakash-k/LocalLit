import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, LogOut, Edit3, ArrowUpRight, BookOpen, Trash2, Camera } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';
import useAuth from '../hooks/useAuth';
import userService from '../services/userService';
import bookService from '../services/bookService';
import reviewService from '../services/reviewService';
import { getAvatarUrl } from '../utils/imageUtils';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('books');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ books_listed: 0, exchanges: 0, rating: 0 });

  // Editable fields
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = React.useRef(null);

  useEffect(() => { if (user) loadProfile(); }, [user]);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileRes, booksRes] = await Promise.all([
        userService.getCurrentUser().catch(() => null),
        bookService.getBooksBySeller(user.id || user.user_id).catch(() => null),
      ]);

      const profile = profileRes?.user || profileRes?.data || profileRes || user;
      setProfileData(profile);

      const books = booksRes?.books || booksRes?.data || booksRes || [];
      setUserBooks(Array.isArray(books) ? books : []);

      // Load stats
      try {
        const statsRes = await userService.getUserStats();
        const s = statsRes?.stats || statsRes?.data || statsRes || {};
        setStats({ books_listed: s.books_listed || books.length || 0, exchanges: s.exchanges || s.exchange_count || 0, rating: s.average_rating || s.rating || 0 });
      } catch { setStats({ books_listed: Array.isArray(books) ? books.length : 0, exchanges: 0, rating: 0 }); }

      // Load reviews
      try {
        const reviewsRes = await reviewService.getUserReviews(user.id || user.user_id);
        const r = reviewsRes?.reviews || reviewsRes?.data || reviewsRes || [];
        setReviews(Array.isArray(r) ? r : []);
      } catch { setReviews([]); }
    } catch (err) {
      console.error('Profile load error:', err);
      setError(err?.response?.data?.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const handleEditSave = async (field) => {
    setSaving(true);
    try {
      await userService.updateProfile({ [field]: editValue });
      setProfileData(prev => ({ ...prev, [field]: editValue }));
      setEditingField(null);
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBook = async (e, bookId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.deleteBook(bookId);
        setUserBooks(prev => prev.filter(b => (b.id || b.book_id) !== bookId));
        setStats(prev => ({ ...prev, books_listed: Math.max(0, prev.books_listed - 1) }));
      } catch (err) {
        console.error('Failed to delete book:', err);
        alert(err?.response?.data?.message || 'Failed to delete book');
      }
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingAvatar(true);
    try {
      const res = await userService.uploadProfileImage(formData);
      setProfileData(prev => ({ 
        ...prev, 
        profile_image: res.avatar_url || res.user?.profile_image,
        avatar_url: res.avatar_url || res.user?.avatar_url 
      }));
    } catch (err) {
      console.error('Failed to upload avatar:', err);
      alert(err?.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const condColor = (c) => {
    const m = { excellent: '#2A7D4F', good: '#B8860B', fair: '#D97652', poor: '#C44B2B' };
    return m[(c || '').toLowerCase()] || '#8C7B6A';
  };

  const tabs = [
    { key: 'books', label: `My Books (${userBooks.length})` },
    { key: 'reviews', label: `Reviews (${reviews.length})` },
    { key: 'settings', label: 'Settings' },
  ];

  if (loading) return (<div style={{ background: '#FAF6EE', minHeight: '100vh' }}><Navbar /><LoadingSpinner message="Loading profile..." /></div>);
  if (error) return (<div style={{ background: '#FAF6EE', minHeight: '100vh' }}><Navbar /><div className="max-w-4xl mx-auto px-4 py-8"><ErrorMessage message={error} /></div></div>);

  const p = profileData || user || {};

  return (
    <div style={{ background: '#FAF6EE', minHeight: '100vh' }}>
      <Navbar />
      <div className="relative">
        <div className="h-36 lg:h-44" style={{ background: 'linear-gradient(135deg, #7A4F1E, #C4893A)' }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-14 mb-6">
            <div className="relative group cursor-pointer" onClick={() => !uploadingAvatar && fileInputRef.current?.click()}>
              <img src={getAvatarUrl(p.avatar_url || p.profile_image, 150)} alt={p.name}
                className={`w-28 h-28 rounded-xl object-cover transition-opacity ${uploadingAvatar ? 'opacity-50' : ''}`} style={{ border: '4px solid #FAF6EE', boxShadow: '0 4px 12px rgba(122,79,30,0.15)' }}
                onError={(e) => { e.target.src = getAvatarUrl(null, 150); }} />
              
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-8 w-8 text-white opacity-80" />
              </div>
              
              {uploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417', fontWeight: '700' }}>{p.name || 'User'}</h1>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap" style={{ color: '#8C7B6A' }}>
                {(p.city || p.location) && <><MapPin className="h-4 w-4" /><span className="text-sm">{p.city}{p.state ? `, ${p.state}` : ''}{!p.city && p.location ? p.location : ''}</span><span className="mx-2">•</span></>}
                <span className="text-sm">Joined {p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'recently'}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              style={{ color: '#C44B2B', border: '1px solid rgba(196,75,43,0.2)' }}>
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Books Listed', value: stats.books_listed },
              { label: 'Exchanges', value: stats.exchanges },
              { label: 'Avg Rating', value: stats.rating ? Number(stats.rating).toFixed(1) : '—', suffix: stats.rating ? '★' : '' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg p-4 text-center" style={{ background: '#FFFCF5', border: '0.5px solid rgba(122,79,30,0.1)' }}>
                <p className="text-2xl lg:text-3xl font-bold" style={{ color: '#7A4F1E', fontFamily: "'Playfair Display', serif" }}>{stat.value}{stat.suffix || ''}</p>
                <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: '#B3A394' }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-0" style={{ borderBottom: '0.5px solid rgba(122,79,30,0.12)' }}>
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className="px-5 py-3 text-sm font-medium transition-all relative"
                style={{ color: activeTab === tab.key ? '#7A4F1E' : '#8C7B6A', borderBottom: activeTab === tab.key ? '2px solid #7A4F1E' : '2px solid transparent' }}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-6">
            {activeTab === 'books' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417' }}>My Books</h2>
                  <button onClick={() => navigate('/add-book')} className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium text-white"
                    style={{ background: '#2A6B5C' }} onMouseEnter={(e) => e.currentTarget.style.background='#205549'} onMouseLeave={(e) => e.currentTarget.style.background='#2A6B5C'}>
                    + Add Book
                  </button>
                </div>
                {userBooks.length > 0 ? (
                  <div className="rounded-lg overflow-hidden" style={{ background: '#FFFCF5', border: '0.5px solid rgba(122,79,30,0.1)' }}>
                    <table className="w-full text-sm">
                      <thead><tr style={{ borderBottom: '0.5px solid rgba(122,79,30,0.1)' }}>
                        {['Title', 'Author', 'Condition', 'Type', 'Price', 'Actions'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#B3A394' }}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {userBooks.map(book => (
                          <tr key={book.id || book.book_id} className="transition-colors cursor-pointer" style={{ borderBottom: '0.5px solid rgba(122,79,30,0.06)' }}
                            onClick={() => navigate(`/book-details/${book.id || book.book_id}`)}
                            onMouseEnter={(e) => e.currentTarget.style.background='rgba(122,79,30,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background='transparent'}>
                            <td className="px-4 py-3 font-semibold" style={{ color: '#2C2417', fontFamily: "'Playfair Display', serif" }}>{book.title}</td>
                            <td className="px-4 py-3" style={{ color: '#8C7B6A' }}>{book.author}</td>
                            <td className="px-4 py-3"><span className="text-xs font-semibold capitalize" style={{ color: condColor(book.condition) }}>{book.condition}</span></td>
                            <td className="px-4 py-3 capitalize" style={{ color: '#8C7B6A' }}>{book.type}</td>
                            <td className="px-4 py-3" style={{ color: '#7A4F1E', fontFamily: "'JetBrains Mono', monospace", fontWeight: '600' }}>
                              {book.type === 'sell' && book.price ? `₹${book.price}` : '—'}
                            </td>
                            <td className="px-4 py-3 flex items-center gap-3 h-full pt-4">
                              <ArrowUpRight className="h-4 w-4" style={{ color: '#8C7B6A' }} />
                              <button 
                                onClick={(e) => handleDeleteBook(e, book.id || book.book_id)} 
                                className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-md" 
                                style={{ background: 'rgba(196,75,43,0.05)' }}
                                title="Delete Book"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 rounded-lg" style={{ background: '#FFFCF5', border: '0.5px solid rgba(122,79,30,0.1)' }}>
                    <BookOpen className="h-10 w-10 mx-auto mb-3" style={{ color: '#B3A394' }} />
                    <p className="text-sm font-medium" style={{ color: '#2C2417' }}>No books listed yet</p>
                    <p className="text-xs mt-1" style={{ color: '#8C7B6A' }}>Share your first book with the community</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map(r => (
                      <div key={r.id || r.review_id} className="rounded-lg p-5" style={{ background: '#FFFCF5', border: '0.5px solid rgba(122,79,30,0.1)' }}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold" style={{ color: '#2C2417' }}>{r.reviewer_name || r.reviewer || 'Anonymous'}</p>
                          <div className="flex gap-0.5">{[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4" style={{ color: i < (r.rating || 0) ? '#B8860B' : '#D5CBBD', fill: i < (r.rating || 0) ? '#B8860B' : 'none' }} />
                          ))}</div>
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
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="rounded-lg p-6" style={{ background: '#FFFCF5', border: '0.5px solid rgba(122,79,30,0.1)' }}>
                <h2 className="text-lg font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417' }}>Profile Settings</h2>
                <div className="space-y-5">
                  {[{ label: 'Name', key: 'name', value: p.name || '' }, { label: 'Email', key: 'email', value: p.email || '' },
                    { label: 'City', key: 'city', value: p.city || '' }, { label: 'State', key: 'state', value: p.state || '' }].map(field => (
                    <div key={field.key} className="flex items-center justify-between py-3" style={{ borderBottom: '0.5px solid rgba(122,79,30,0.06)' }}>
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#B3A394' }}>{field.label}</p>
                        {editingField === field.key ? (
                          <div className="flex items-center gap-2 mt-1">
                            <input type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)} className="input-field flex-1 py-1 text-sm" />
                            <button onClick={() => handleEditSave(field.key)} disabled={saving}
                              className="text-xs font-semibold px-3 py-1.5 rounded-md text-white" style={{ background: '#2A6B5C' }}>
                              {saving ? '...' : 'Save'}
                            </button>
                            <button onClick={() => setEditingField(null)} className="text-xs px-2 py-1.5" style={{ color: '#8C7B6A' }}>Cancel</button>
                          </div>
                        ) : (
                          <p className="mt-1 font-medium" style={{ color: '#2C2417' }}>{field.value || '—'}</p>
                        )}
                      </div>
                      {editingField !== field.key && field.key !== 'email' && (
                        <button onClick={() => { setEditingField(field.key); setEditValue(field.value); }}
                          className="p-2 rounded-md transition-colors" style={{ color: '#8C7B6A' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(122,79,30,0.04)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                          <Edit3 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
