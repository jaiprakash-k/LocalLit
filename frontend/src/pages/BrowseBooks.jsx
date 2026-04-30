import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, LayoutGrid, List, X, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import BookCard from '../components/Books/BookCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';
import bookService from '../services/bookService';

/**
 * Browse Books — Librarian Luxe
 * Connected to real backend API
 */
const BrowseBooks = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
  });
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState({ searchQuery: '', city: '', state: '', condition: '', type: '' });
  const [expandedSections, setExpandedSections] = useState({ city: true, state: true, condition: true, type: true });

  // Dynamic filter options derived from data
  const [filterOptions, setFilterOptions] = useState({ cities: [], states: [], conditions: [], types: [] });

  useEffect(() => { loadBooks(); }, []);

  const loadBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookService.getAllBooks();
      const data = response.books || response.data || response || [];
      const bookList = Array.isArray(data) ? data : [];
      setBooks(bookList);
      setFilteredBooks(bookList);

      // Extract unique filter options
      const cities = [...new Set(bookList.map(b => b.owner_city || b.city).filter(Boolean))];
      const states = [...new Set(bookList.map(b => b.owner_state || b.state).filter(Boolean))];
      const conditions = [...new Set(bookList.map(b => b.condition).filter(Boolean))];
      const types = [...new Set(bookList.map(b => b.type).filter(Boolean))];
      setFilterOptions({ cities, states, conditions, types });
    } catch (err) {
      console.error('Failed to load books:', err);
      setError(err?.response?.data?.message || 'Failed to load books. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = books;
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(b =>
        (b.title || '').toLowerCase().includes(q) ||
        (b.author || '').toLowerCase().includes(q)
      );
    }
    if (filters.city) result = result.filter(b => (b.owner_city || b.city) === filters.city);
    if (filters.state) result = result.filter(b => (b.owner_state || b.state) === filters.state);
    if (filters.condition) result = result.filter(b => b.condition === filters.condition);
    if (filters.type) result = result.filter(b => b.type === filters.type);

    if (sortBy === 'price-low') result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === 'price-high') result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sortBy === 'newest') result = [...result].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    if (sortBy === 'location') result = [...result].sort((a, b) => (a.owner_city || '').localeCompare(b.owner_city || ''));

    setFilteredBooks(result);
  }, [filters, books, sortBy]);

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const handleAddWishlist = (bookId) => {
    let updated;
    if (wishlist.includes(bookId)) updated = wishlist.filter(id => id !== bookId);
    else updated = [...wishlist, bookId];
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };
  const clearFilter = (key) => setFilters(prev => ({ ...prev, [key]: '' }));
  const activeFilters = Object.entries(filters).filter(([k, v]) => v && k !== 'searchQuery');
  const toggleSection = (s) => setExpandedSections(prev => ({ ...prev, [s]: !prev[s] }));

  const FilterSection = ({ title, sectionKey, children }) => (
    <div style={{ borderBottom: '0.5px solid rgba(122, 79, 30, 0.08)' }}>
      <button onClick={() => toggleSection(sectionKey)} className="w-full flex items-center justify-between px-5 py-3 text-left">
        <span className="text-sm font-semibold" style={{ color: '#2C2417' }}>{title}</span>
        {expandedSections[sectionKey] ? <ChevronUp className="h-4 w-4" style={{ color: '#8C7B6A' }} /> : <ChevronDown className="h-4 w-4" style={{ color: '#8C7B6A' }} />}
      </button>
      {expandedSections[sectionKey] && <div className="px-5 pb-4">{children}</div>}
    </div>
  );

  const RadioOption = ({ label, value, currentValue }) => (
    <label className="flex items-center gap-2.5 py-1.5 cursor-pointer">
      <div className="w-4 h-4 rounded-full flex items-center justify-center transition-all"
        style={{ border: value === currentValue ? '2px solid #2A6B5C' : '1.5px solid rgba(122, 79, 30, 0.2)', background: value === currentValue ? '#2A6B5C' : 'transparent' }}>
        {value === currentValue && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
      </div>
      <span className="text-sm" style={{ color: value === currentValue ? '#2C2417' : '#8C7B6A' }}>{label}</span>
    </label>
  );

  return (
    <div style={{ background: '#FAF6EE', minHeight: '100vh' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl mb-1" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417', fontWeight: '700' }}>Browse Books</h1>
            <p className="text-sm" style={{ color: '#8C7B6A' }}>{filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} available</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowMobileFilters(!showMobileFilters)} className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium"
              style={{ border: '1px solid rgba(122, 79, 30, 0.15)', color: '#7A4F1E' }}>
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="text-sm py-2 px-3 rounded-md" style={{ border: '1px solid rgba(122, 79, 30, 0.15)', background: '#FFFCF5', color: '#2C2417', width: 'auto', fontSize: '13px' }}>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="location">Location (City)</option>
            </select>
            <div className="hidden sm:flex rounded-md overflow-hidden" style={{ border: '1px solid rgba(122, 79, 30, 0.15)' }}>
              <button onClick={() => setViewMode('grid')} className="p-2 transition-colors"
                style={{ background: viewMode === 'grid' ? 'rgba(122, 79, 30, 0.08)' : 'transparent', color: viewMode === 'grid' ? '#7A4F1E' : '#8C7B6A' }}>
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button onClick={() => setViewMode('list')} className="p-2 transition-colors"
                style={{ background: viewMode === 'list' ? 'rgba(122, 79, 30, 0.08)' : 'transparent', color: viewMode === 'list' ? '#7A4F1E' : '#8C7B6A' }}>
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map(([key, value]) => (
              <span key={key} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: 'rgba(42, 107, 92, 0.08)', color: '#2A6B5C', border: '1px solid rgba(42, 107, 92, 0.15)' }}>
                {key}: {value}
                <button onClick={() => clearFilter(key)}><X className="h-3 w-3" /></button>
              </span>
            ))}
            <button onClick={() => setFilters({ searchQuery: filters.searchQuery, city: '', state: '', condition: '', type: '' })}
              className="text-xs font-medium px-2 py-1" style={{ color: '#C44B2B' }}>Clear all</button>
          </div>
        )}

        <div className="flex gap-6">
          <aside className={`w-64 flex-shrink-0 rounded-lg overflow-hidden sticky top-16 self-start ${showMobileFilters ? 'fixed inset-0 z-50 w-full h-full lg:relative lg:w-64' : 'hidden lg:block'}`}
            style={{ background: '#FFFCF5', border: '0.5px solid rgba(122, 79, 30, 0.1)', maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}>
            <div className="p-5" style={{ borderBottom: '0.5px solid rgba(122, 79, 30, 0.08)' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold" style={{ color: '#2C2417' }}>Filters</h3>
                {showMobileFilters && <button onClick={() => setShowMobileFilters(false)} className="lg:hidden"><X className="h-4 w-4" style={{ color: '#8C7B6A' }} /></button>}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#8C7B6A' }} />
                <input type="text" value={filters.searchQuery} onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  placeholder="Search..." className="input-field pl-9 py-2 text-sm" />
              </div>
            </div>

            <FilterSection title="City" sectionKey="city">
              <div onClick={() => handleFilterChange('city', '')}><RadioOption label="All Cities" value="" currentValue={filters.city} /></div>
              {filterOptions.cities.length > 0 ? (
                filterOptions.cities.map(city => (
                  <div key={city} onClick={() => handleFilterChange('city', city)}><RadioOption label={city} value={city} currentValue={filters.city} /></div>
                ))
              ) : (
                <p className="text-xs italic px-6 py-2" style={{ color: '#B3A394' }}>No cities available</p>
              )}
            </FilterSection>

            <FilterSection title="State" sectionKey="state">
              <div onClick={() => handleFilterChange('state', '')}><RadioOption label="All States" value="" currentValue={filters.state} /></div>
              {filterOptions.states.length > 0 ? (
                filterOptions.states.map(state => (
                  <div key={state} onClick={() => handleFilterChange('state', state)}><RadioOption label={state} value={state} currentValue={filters.state} /></div>
                ))
              ) : (
                <p className="text-xs italic px-6 py-2" style={{ color: '#B3A394' }}>No states available</p>
              )}
            </FilterSection>

            {filterOptions.conditions.length > 0 && (
              <FilterSection title="Condition" sectionKey="condition">
                <div onClick={() => handleFilterChange('condition', '')}><RadioOption label="All" value="" currentValue={filters.condition} /></div>
                {filterOptions.conditions.map(cond => (
                  <div key={cond} onClick={() => handleFilterChange('condition', cond)}><RadioOption label={cond} value={cond} currentValue={filters.condition} /></div>
                ))}
              </FilterSection>
            )}

            {filterOptions.types.length > 0 && (
              <FilterSection title="Type" sectionKey="type">
                <div onClick={() => handleFilterChange('type', '')}><RadioOption label="All Types" value="" currentValue={filters.type} /></div>
                {filterOptions.types.map(type => (
                  <div key={type} onClick={() => handleFilterChange('type', type)}>
                    <RadioOption label={type === 'lend' ? 'Lend' : type === 'sell' ? 'Sell' : type} value={type} currentValue={filters.type} />
                  </div>
                ))}
              </FilterSection>
            )}
          </aside>

          <main className="flex-1 min-w-0">
            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
            {loading && <LoadingSpinner message="Loading books..." />}

            {!loading && !error && (
              <>
                {filteredBooks.length > 0 ? (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-4'}>
                    {filteredBooks.map(book => (
                      <BookCard key={book.id || book.book_id} book={book} onAddWishlist={handleAddWishlist}
                        isInWishlist={wishlist.includes(book.id || book.book_id)} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Search className="h-12 w-12 mx-auto mb-4" style={{ color: '#B3A394' }} />
                    <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417' }}>No books found</h3>
                    <p className="text-sm" style={{ color: '#8C7B6A' }}>Try adjusting your filters or search query</p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BrowseBooks;
