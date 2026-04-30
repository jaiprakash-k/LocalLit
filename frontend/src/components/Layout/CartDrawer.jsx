import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getBookCoverUrl } from '../../utils/imageUtils';
import { formatPrice } from '../../utils/currency';

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const items = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(items);
    }
  }, [isOpen]);

  const removeItem = (id) => {
    const updated = cartItems.filter(item => item.book_id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const total = cartItems.reduce((acc, item) => acc + parseFloat(item.price || 0), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md transform transition-all animate-slideInRight" style={{ background: '#FAF6EE', shadow: '-8px 0 24px rgba(122, 79, 30, 0.12)' }}>
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-[#D5CBBD] bg-[#FFFCF5]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" style={{ color: '#7A4F1E' }} />
                <h2 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417' }}>Your Library Cart</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(122, 79, 30, 0.05)' }}>
                    <ShoppingBag className="h-8 w-8 text-[#B3A394]" />
                  </div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#2C2417' }}>Your cart is empty</h3>
                  <p className="text-sm text-[#8C7B6A] mb-6">Find some literary treasures to add here.</p>
                  <button onClick={() => { onClose(); navigate('/browse'); }} className="btn-primary py-2.5 px-6">Start Browsing</button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.book_id} className="flex gap-4 group">
                      <div className="w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden shadow-sm border border-[#D5CBBD]">
                        <img src={getBookCoverUrl(item.image_url || item.images?.[0]?.image_url, 80, 112)} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-[#2C2417] leading-tight line-clamp-2 pr-2" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h4>
                          <button onClick={() => removeItem(item.book_id)} className="p-1 text-[#B3A394] hover:text-[#C44B2B] transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-[#8C7B6A] mt-1">{item.author}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="font-bold text-[#7A4F1E]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{formatPrice(item.price)}</p>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#2A6B5C] bg-[#E8F3F1] px-2 py-0.5 rounded transition-all">{item.condition}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-[#FFFCF5] border-t border-[#D5CBBD] space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#8C7B6A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Subtotal</span>
                  <span className="text-2xl font-bold text-[#2C2417]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{formatPrice(total)}</span>
                </div>
                <button onClick={() => { onClose(); navigate('/checkout'); }} className="w-full flex items-center justify-center gap-2 py-4 bg-[#2A6B5C] text-white rounded-xl font-bold transition-all hover:bg-[#205549] shadow-lg shadow-teal-900/10">
                  Secure Checkout <ArrowRight className="h-5 w-5" />
                </button>
                <button onClick={onClose} className="w-full py-2 text-sm text-[#8C7B6A] hover:text-[#2C2417] transition-colors">Continue Browsing</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
