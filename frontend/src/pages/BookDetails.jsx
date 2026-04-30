import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Heart, MessageSquare, MapPin, Star, ChevronRight, ShoppingCart, Send, User as UserIcon } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';
import useAuth from '../hooks/useAuth';
import bookService from '../services/bookService';
import exchangeService from '../services/exchangeService';
import { getBookCoverUrl, getAvatarUrl } from '../utils/imageUtils';
import { formatPrice } from '../utils/currency';
import chatService from '../services/chatService';

const getConditionStyle = (condition) => {
  const c = (condition || '').toLowerCase();
  const map = {
    new: { bg: 'rgba(42,125,79,0.1)', color: '#2A7D4F', border: 'rgba(42,125,79,0.2)' },
    like_new: { bg: 'rgba(42,125,79,0.1)', color: '#2A7D4F', border: 'rgba(42,125,79,0.2)' },
    excellent: { bg: 'rgba(42,125,79,0.1)', color: '#2A7D4F', border: 'rgba(42,125,79,0.2)' },
    good: { bg: 'rgba(184,134,11,0.1)', color: '#B8860B', border: 'rgba(184,134,11,0.2)' },
    fair: { bg: 'rgba(217,118,82,0.1)', color: '#D97652', border: 'rgba(217,118,82,0.2)' },
    poor: { bg: 'rgba(196,75,43,0.1)', color: '#C44B2B', border: 'rgba(196,75,43,0.2)' },
  };
  return map[c] || { bg: 'rgba(140,123,106,0.1)', color: '#8C7B6A', border: 'rgba(140,123,106,0.2)' };
};

const BookDetails = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const { isAuthenticated, user } = useAuth();

  const [book, setBook] = useState(null);
  const [moreBooks, setMoreBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [myBooks, setMyBooks] = useState([]);
  const [selectedOfferedBook, setSelectedOfferedBook] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsInWishlist(wishlist.includes(parseInt(bookId)));
    loadBook();
  }, [bookId]);

  const loadBook = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookService.getBookById(bookId);
      const bookData = response.book || response.data || response;
      setBook(bookData);

      // Load more books from the same seller
      if (bookData.seller_id || bookData.user_id) {
        try {
          const sellerRes = await bookService.getBooksBySeller(bookData.seller_id || bookData.user_id);
          const sellerBooks = sellerRes.books || sellerRes.data || sellerRes || [];
          setMoreBooks(Array.isArray(sellerBooks) ? sellerBooks.filter(b => (b.id || b.book_id) !== parseInt(bookId)).slice(0, 4) : []);
        } catch { /* ignore */ }
      }
    } catch (err) {
      console.error('Failed to load book:', err);
      setError(err?.response?.data?.message || 'Failed to load book details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (offeredBookId = null) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setRequesting(true);
    setRequestError('');
    try {
      await exchangeService.createExchange({
        owner_id: book.seller_id || book.user_id,
        requested_book_id: book.id || book.book_id,
        offered_book_id: offeredBookId,
      });
      setShowConfirmation(true);
      setShowSwapModal(false);
      setTimeout(() => navigate('/requests'), 2000);
    } catch (err) {
      console.error('Request failed:', err);
      setRequestError(err?.response?.data?.message || 'Failed to send request.');
    } finally {
      setRequesting(false);
    }
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const id = parseInt(bookId);
    if (!cart.some(item => item.book_id === id)) {
      cart.push({ ...book, book_id: id });
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdate'));
    }
  };

  const handleChatWithSeller = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      const res = await chatService.createChat({
        book_id: book.id || book.book_id,
        receiver_id: book.seller_id || book.user_id
      });
      navigate(`/chat?id=${res.chat.chat_id}`);
    } catch (err) {
      console.error('Chat creation failed:', err);
    }
  };

  const openSwapModal = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setShowSwapModal(true);
    try {
      const res = await bookService.getBooksBySeller(user.user_id);
      const mine = res.books || res.data || res || [];
      setMyBooks(Array.isArray(mine) ? mine.filter(b => b.status === 'available') : []);
    } catch (err) { console.error('Failed to load my books:', err); }
  };

  const handleAddWishlist = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const id = parseInt(bookId);
    let updated;
    if (wishlist.includes(id)) updated = wishlist.filter(wid => wid !== id);
    else updated = [...wishlist, id];
    localStorage.setItem('wishlist', JSON.stringify(updated));
    setIsInWishlist(!isInWishlist);
  };

  if (loading) return (<div style={{ background: '#FAF6EE', minHeight: '100vh' }}><Navbar /><LoadingSpinner message="Loading book details..." /></div>);
  if (error) return (<div style={{ background: '#FAF6EE', minHeight: '100vh' }}><Navbar /><div className="max-w-4xl mx-auto px-4 py-8"><ErrorMessage message={error} /></div></div>);
  if (!book) return (<div style={{ background: '#FAF6EE', minHeight: '100vh' }}><Navbar /><div className="max-w-4xl mx-auto px-4 py-8"><ErrorMessage message="Book not found" /></div></div>);

  const conditionStyle = getConditionStyle(book.condition);
  const coverUrl = getBookCoverUrl(book.image_url || book.images?.[0]?.image_url, 400, 600);

  return (
    <div style={{ background: '#FAF6EE', minHeight: '100vh' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6" style={{ color: '#8C7B6A' }}>
          <button onClick={() => navigate('/browse')} className="hover:underline" style={{ color: '#2A6B5C' }}>Browse</button>
          <ChevronRight className="h-3.5 w-3.5" />
          <span style={{ color: '#2C2417' }}>{book.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Cover Image */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 rounded-lg overflow-hidden" style={{ background: '#FFFCF5', border: '0.5px solid rgba(122,79,30,0.1)', boxShadow: '4px 4px 16px rgba(122,79,30,0.08)' }}>
              <img src={coverUrl} alt={book.title} className="w-full h-96 object-cover"
                onError={(e) => { e.target.src = getBookCoverUrl(null, 400, 600); }} />
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-3">
            <div className="rounded-lg p-8" style={{ background: '#FFFCF5', border: '0.5px solid rgba(122,79,30,0.1)' }}>
              {book.category && <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#2A6B5C' }}>{typeof book.category === 'object' ? book.category.category_name : book.category}</p>}
              <h1 className="text-3xl lg:text-4xl mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417', fontWeight: '700' }}>{book.title}</h1>
              <p className="text-lg mb-6" style={{ color: '#8C7B6A' }}>by {book.author || 'Unknown Author'}</p>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6" style={{ borderBottom: '0.5px solid rgba(122,79,30,0.1)' }}>
                {book.condition && (
                  <div>
                    <p className="text-xs font-semibold uppercase" style={{ color: '#B3A394' }}>Condition</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-xs font-semibold capitalize"
                      style={{ background: conditionStyle.bg, color: conditionStyle.color, border: `1px solid ${conditionStyle.border}` }}>{book.condition}</span>
                  </div>
                )}
                {book.listing_type && <div><p className="text-xs font-semibold uppercase" style={{ color: '#B3A394' }}>Type</p><p className="mt-1 capitalize font-semibold" style={{ color: '#2C2417' }}>{book.listing_type}</p></div>}
                {book.pages && <div><p className="text-xs font-semibold uppercase" style={{ color: '#B3A394' }}>Pages</p><p className="mt-1 font-semibold" style={{ color: '#2C2417' }}>{book.pages}</p></div>}
                {book.published_year && <div><p className="text-xs font-semibold uppercase" style={{ color: '#B3A394' }}>Year</p><p className="mt-1 font-semibold" style={{ color: '#2C2417' }}>{book.published_year}</p></div>}
              </div>

               {/* Price */}
              {book.listing_type === 'sell' && book.price && (
                <div className="mb-6"><p className="text-xs font-semibold uppercase" style={{ color: '#B3A394' }}>Price</p>
                  <p className="text-3xl font-bold mt-1" style={{ color: '#7A4F1E', fontFamily: "'JetBrains Mono', monospace" }}>{formatPrice(book.price)}</p></div>
              )}
              {book.listing_type === 'lend' && (
                <div className="mb-6"><span className="inline-block px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: 'rgba(42,107,92,0.08)', color: '#2A6B5C', border: '1px solid rgba(42,107,92,0.15)' }}>Available for Lending</span></div>
              )}
              {book.listing_type === 'swap' && (
                <div className="mb-6"><span className="inline-block px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: 'rgba(122,79,30,0.08)', color: '#7A4F1E', border: '1px solid rgba(122,79,30,0.15)' }}>Available for Swap</span></div>
              )}

              {/* Description */}
              {book.description && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417' }}>Description</h2>
                  <p className="leading-relaxed" style={{ color: '#8C7B6A', fontSize: '15px' }}>{book.description}</p>
                </div>
              )}

              {/* Owner Card */}
              {(book.owner_name || book.seller_name || book.seller?.name || book.user_id || book.seller_id) && (
                <div className="rounded-lg p-5 mb-6" style={{ background: 'rgba(122,79,30,0.03)', border: '0.5px solid rgba(122,79,30,0.08)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417' }}>Book Owner</h2>
                    <button onClick={() => navigate(`/user/${book.user_id || book.seller_id}`)} className="text-sm font-semibold flex items-center gap-1" style={{ color: '#2A6B5C' }} onMouseEnter={(e) => e.currentTarget.style.color='#205549'} onMouseLeave={(e) => e.currentTarget.style.color='#2A6B5C'}>
                      View Profile <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src={getAvatarUrl(book.owner_avatar || book.seller_avatar || book.seller?.profile_image, 50)} alt="Owner" className="w-12 h-12 rounded-full object-cover" style={{ border: '2px solid #FAF6EE', boxShadow: '0 2px 8px rgba(122,79,30,0.1)' }} />
                    <div>
                      <p className="font-semibold" style={{ color: '#2C2417' }}>{book.owner_name || book.seller_name || book.seller?.name || 'Library Member'}</p>
                      {(book.owner_city || book.city || book.seller?.city) && (
                        <div className="flex items-center gap-1.5 mt-1" style={{ color: '#8C7B6A' }}>
                          <MapPin className="h-3.5 w-3.5" /><span className="text-sm">{book.owner_city || book.city || book.seller?.city || book.seller?.UserLocation?.city}{book.owner_state || book.state || book.seller?.state || book.seller?.UserLocation?.state ? `, ${book.owner_state || book.state || book.seller?.state || book.seller?.UserLocation?.state}` : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  {book.listing_type === 'sell' ? (
                    <button onClick={() => navigate('/checkout')} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all text-white"
                      style={{ background: '#2A6B5C' }} onMouseEnter={(e) => e.currentTarget.style.background='#205549'} onMouseLeave={(e) => e.currentTarget.style.background='#2A6B5C'}>
                      Buy Now
                    </button>
                  ) : book.listing_type === 'swap' ? (
                    <button onClick={openSwapModal} disabled={requesting} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all text-white disabled:opacity-50"
                      style={{ background: '#7A4F1E' }} onMouseEnter={(e) => e.currentTarget.style.background='#633F18'} onMouseLeave={(e) => e.currentTarget.style.background='#7A4F1E'}>
                      <ArrowRight className="h-5 w-5" /> {requesting ? 'Sending...' : 'Offer Swap'}
                    </button>
                  ) : (
                    <button onClick={() => handleSendRequest()} disabled={requesting} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all text-white disabled:opacity-50"
                      style={{ background: '#2A6B5C' }} onMouseEnter={(e) => e.currentTarget.style.background='#205549'} onMouseLeave={(e) => e.currentTarget.style.background='#2A6B5C'}>
                      <MessageSquare className="h-5 w-5" /> {requesting ? 'Sending...' : 'Request to Borrow'}
                    </button>
                  )}
                  <button onClick={handleAddWishlist} className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
                    style={{ background: isInWishlist ? 'rgba(196,75,43,0.08)' : 'transparent', color: isInWishlist ? '#C44B2B' : '#7A4F1E', border: `1.5px solid ${isInWishlist ? 'rgba(196,75,43,0.2)' : 'rgba(122,79,30,0.2)'}` }}>
                    <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <div className="flex gap-3">
                  {book.listing_type === 'sell' && (
                    <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all border border-[#D5CBBD] hover:bg-neutral-50"
                      style={{ color: '#2C2417' }}>
                      <ShoppingCart className="h-5 w-5" /> Add to Cart
                    </button>
                  )}
                  <button onClick={handleChatWithSeller} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all border border-[#D5CBBD] hover:bg-neutral-50"
                    style={{ color: '#2C2417' }}>
                    <MessageSquare className="h-5 w-5" /> Chat with Seller
                  </button>
                </div>
              </div>

              {showConfirmation && (
                <div className="mt-4 p-4 rounded-lg" style={{ background: 'rgba(42,107,92,0.08)', border: '1px solid rgba(42,107,92,0.15)', color: '#2A6B5C' }}>
                  <p className="font-semibold text-sm">✓ Request sent successfully! Redirecting...</p>
                </div>
              )}
              {requestError && (
                <div className="mt-4 p-4 rounded-lg" style={{ background: 'rgba(196,75,43,0.08)', border: '1px solid rgba(196,75,43,0.15)', color: '#C44B2B' }}>
                  <p className="font-semibold text-sm">{requestError}</p>
                </div>
              )}
            </div>

            {/* More from owner */}
            {moreBooks.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl mb-4" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417', fontWeight: '700' }}>More from this owner</h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {moreBooks.map(b => (
                    <div key={b.id || b.book_id} className="flex-shrink-0 w-36 rounded-lg overflow-hidden cursor-pointer transition-all"
                      style={{ background: '#FFFCF5', border: '0.5px solid rgba(122,79,30,0.1)' }}
                      onClick={() => navigate(`/book-details/${b.id || b.book_id}`)}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow='0 4px 12px rgba(122,79,30,0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow='none'}>
                      <div className="h-40" style={{ background: '#F5EFE3' }}>
                        <img src={getBookCoverUrl(b.image_url || b.images?.[0]?.image_url, 200, 300)} alt={b.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-semibold line-clamp-1" style={{ color: '#2C2417', fontFamily: "'Playfair Display', serif" }}>{b.title}</p>
                        <p className="text-xs" style={{ color: '#8C7B6A' }}>{b.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[#FAF6EE] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-[#D5CBBD]">
            <div className="p-6 border-b border-[#D5CBBD] flex justify-between items-center bg-[#FFFCF5]">
              <h3 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417' }}>Select a Book to Offer</h3>
              <button onClick={() => setShowSwapModal(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {myBooks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[#8C7B6A] mb-4 text-sm">You haven't added any books yet to offer in swap.</p>
                  <button onClick={() => navigate('/add-book')} className="btn-primary py-2 text-xs">Add a Book</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myBooks.map(b => (
                    <div key={b.book_id} onClick={() => setSelectedOfferedBook(b.book_id)}
                      className={`flex gap-4 p-3 rounded-xl cursor-pointer transition-all border-2 ${selectedOfferedBook === b.book_id ? 'border-[#7A4F1E] bg-[#FFFCF5]' : 'border-transparent bg-white shadow-sm hover:shadow-md'}`}>
                      <img src={getBookCoverUrl(b.images?.[0]?.image_url, 60, 90)} className="w-16 h-20 object-cover rounded-lg" />
                      <div>
                        <p className="font-bold text-[#2C2417]" style={{ fontFamily: "'Playfair Display', serif" }}>{b.title}</p>
                        <p className="text-xs text-[#8C7B6A]">{b.author}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-[#FAF6EE] text-[#7A4F1E] text-[10px] uppercase font-bold tracking-wider rounded border border-[#D5CBBD]">{b.condition}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 bg-[#FFFCF5] border-t border-[#D5CBBD] flex gap-3">
              <button onClick={() => setShowSwapModal(false)} className="flex-1 py-3 border border-[#D5CBBD] rounded-lg font-semibold text-[#8C7B6A]">Cancel</button>
              <button onClick={() => handleSendRequest(selectedOfferedBook)} disabled={!selectedOfferedBook || requesting}
                className="flex-1 py-3 bg-[#7A4F1E] text-white rounded-lg font-semibold disabled:opacity-50">
                {requesting ? 'Sending...' : 'Send Swap Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
