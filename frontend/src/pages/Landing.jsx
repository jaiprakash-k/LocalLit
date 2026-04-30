import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, BookOpen, Users, Repeat } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import bookService from '../services/bookService';
import { AuthContext } from '../context/AuthContext';

/**
 * Landing Page — Librarian Luxe
 * Typographic poster hero, marquee ribbon, editorial feature cards, dark amber footer
 */
const spineColors = ['#7A4F1E', '#2A6B5C', '#C44B2B', '#B8860B', '#5E3B14', '#205549', '#D97652', '#462C0F'];

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [featuredBooks, setFeaturedBooks] = useState([]);

  useEffect(() => {
    bookService.getAllBooks().then(res => {
      const books = res?.books || res?.data || res || [];
      const list = Array.isArray(books) ? books : [];
      setFeaturedBooks(list.slice(0, 10).map((b, i) => ({
        id: b.id || b.book_id,
        title: b.title,
        author: b.author,
        color: spineColors[i % spineColors.length],
      })));
    }).catch(() => setFeaturedBooks([]));
  }, []);

  const features = [
    {
      icon: Search,
      step: '01',
      title: 'Find',
      description: 'Browse thousands of books available in your community. Search by title, author, or genre.',
    },
    {
      icon: Users,
      step: '02',
      title: 'Connect',
      description: 'Chat directly with book owners. Arrange meetups or exchanges on your own terms.',
    },
    {
      icon: Repeat,
      step: '03',
      title: 'Exchange',
      description: 'Lend, borrow, or sell. Rate your experience and build trust in the community.',
    },
  ];

  return (
    <div style={{ background: '#FAF6EE' }}>
      <Navbar />

      {/* ========== HERO SECTION ========== */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FAF6EE 0%, #F5EFE3 50%, #F0E8D8 100%)',
          minHeight: '80vh',
        }}
      >
        {/* Decorative background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-[0.06]"
            style={{ background: 'radial-gradient(circle, #7A4F1E, transparent)' }}
          />
          <div
            className="absolute bottom-0 -left-32 w-80 h-80 rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #2A6B5C, transparent)' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-32">
          <div className="max-w-3xl">
            {/* Tagline */}
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-6"
              style={{ color: '#2A6B5C', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.15em' }}
            >
              A community for book lovers
            </p>

            {/* Main Headline */}
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl leading-[1.1] mb-6"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: '#2C2417',
                fontWeight: '700',
              }}
            >
              Books find<br />
              <span style={{ color: '#7A4F1E' }}>homes</span> here.
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg sm:text-xl max-w-lg mb-10 leading-relaxed"
              style={{ color: '#8C7B6A', fontFamily: "'DM Sans', sans-serif" }}
            >
              Exchange, lend, and discover books from readers in your neighborhood. Because every book deserves another chapter.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/browse')}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg text-white font-semibold transition-all text-base"
                style={{ background: '#2A6B5C' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#205549'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#2A6B5C'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Browse Books
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate(isAuthenticated ? '/add-book' : '/login')}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg font-semibold transition-all text-base"
                style={{
                  background: 'transparent',
                  color: '#7A4F1E',
                  border: '1.5px solid rgba(122, 79, 30, 0.25)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(122, 79, 30, 0.05)'; e.currentTarget.style.borderColor = '#7A4F1E'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(122, 79, 30, 0.25)'; }}
              >
                List Your Books
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========== MARQUEE — Book Cover Ribbon ========== */}
      <section
        className="overflow-hidden py-8"
        style={{
          borderTop: '0.5px solid rgba(122, 79, 30, 0.1)',
          borderBottom: '0.5px solid rgba(122, 79, 30, 0.1)',
          background: '#FFFCF5',
        }}
      >
        <div className="flex animate-marquee" style={{ width: 'max-content' }}>
          {[...featuredBooks, ...featuredBooks].map((book, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-3 rounded-md overflow-hidden transition-transform hover:scale-105 cursor-pointer"
              style={{
                width: '120px',
                height: '170px',
                background: book.color,
                boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
              }}
              onClick={() => navigate(`/book-details/${book.id}`)}
            >
              <div className="h-full flex flex-col justify-end p-3">
                <p
                  className="text-white text-xs font-bold leading-tight line-clamp-2 mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {book.title}
                </p>
                <p className="text-white/70 text-[10px] line-clamp-1">{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== FEATURES — Editorial Cards ========== */}
      <section className="py-20 lg:py-28" style={{ background: '#FAF6EE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: '#2A6B5C', letterSpacing: '0.15em' }}
            >
              How it works
            </p>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: '#2C2417',
                fontWeight: '700',
              }}
            >
              Three simple steps
            </h2>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="group rounded-xl p-8 lg:p-10 transition-all"
                  style={{
                    background: '#FFFCF5',
                    border: '0.5px solid rgba(122, 79, 30, 0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(122, 79, 30, 0.08)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Step Number */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="text-4xl font-bold"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: 'rgba(122, 79, 30, 0.12)',
                      }}
                    >
                      {feature.step}
                    </span>
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(42, 107, 92, 0.08)' }}
                    >
                      <IconComponent className="h-6 w-6" style={{ color: '#2A6B5C' }} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-2xl mb-3"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: '#2C2417',
                      fontWeight: '700',
                    }}
                  >
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="leading-relaxed" style={{ color: '#8C7B6A', fontSize: '15px' }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== CTA BANNER ========== */}
      <section
        className="py-16 lg:py-20"
        style={{
          background: 'linear-gradient(135deg, #7A4F1E 0%, #5E3B14 100%)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl text-white mb-4"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: '700',
              lineHeight: '1.2',
            }}
          >
            Ready to share your shelf?
          </h2>
          <p
            className="text-lg mb-8 max-w-xl mx-auto"
            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Join thousands of readers who are already exchanging books in their communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(isAuthenticated ? '/add-book' : '/register')}
              className="px-8 py-3.5 rounded-lg font-semibold transition-all text-base"
              style={{ background: 'white', color: '#7A4F1E' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              Get Started — It's Free
            </button>
            <button
              onClick={() => navigate('/browse')}
              className="px-8 py-3.5 rounded-lg font-semibold transition-all text-base"
              style={{ background: 'transparent', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
            >
              Browse First
            </button>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer style={{ background: '#2C2417' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-6 w-6" style={{ color: '#C4893A' }} />
                <h3
                  className="text-xl font-bold"
                  style={{ fontFamily: "'Playfair Display', serif", color: '#F8EBDA' }}
                >
                  LocalLit
                </h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(248, 235, 218, 0.6)' }}>
                A community-driven platform for sharing and exchanging books locally. Because every book deserves another chapter.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: '#C4893A' }}>Explore</h4>
              <ul className="space-y-2.5">
                {['Browse Books', 'How It Works'].map((link) => (
                  <li key={link}>
                    <a href={link === 'Browse Books' ? '/browse' : '#'} className="text-sm transition-colors" style={{ color: 'rgba(248, 235, 218, 0.6)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#F8EBDA'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(248, 235, 218, 0.6)'; }}
                    >{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: '#C4893A' }}>Account</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Sign Up', path: '/register' },
                  { label: 'Sign In', path: '/login' },
                ].map(({ label, path }) => (
                  <li key={label}>
                    <a href={path} className="text-sm transition-colors" style={{ color: 'rgba(248, 235, 218, 0.6)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#F8EBDA'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(248, 235, 218, 0.6)'; }}
                    >{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: '#C4893A' }}>Contact</h4>
              <p className="text-sm" style={{ color: 'rgba(248, 235, 218, 0.6)' }}>
                support@locallit.com<br />
                (555) 123-4567
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4"
            style={{ borderTop: '0.5px solid rgba(248, 235, 218, 0.1)' }}
          >
            <p className="text-xs" style={{ color: 'rgba(248, 235, 218, 0.4)' }}>© 2024 LocalLit. All rights reserved.</p>
            <div className="flex gap-6">
              {['Privacy', 'Terms'].map((link) => (
                <a key={link} href="#" className="text-xs transition-colors" style={{ color: 'rgba(248, 235, 218, 0.4)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#F8EBDA'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(248, 235, 218, 0.4)'; }}
                >{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
