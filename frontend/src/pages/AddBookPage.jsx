import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, ArrowLeft, ArrowRight, Check, Search } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import useAuth from '../hooks/useAuth';
import bookService from '../services/bookService';

const AddBookPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({ title: '', author: '', condition: 'good', listing_type: 'sell', city: '', state: '', price: '', description: '', category: '', newCategory: '', isbn: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    bookService.getCategories().then(res => {
      const cats = res?.categories || res?.data || res || [];
      setCategories(Array.isArray(cats) ? cats : []);
    }).catch(() => setCategories(['Fiction', 'Non-Fiction', 'Science & Technology', 'Biography', 'History', 'Mystery & Thriller', 'Romance', 'Self-Help', 'Education', 'Art & Design']));
  }, []);

  const conditions = [
    { label: 'New', value: 'new' },
    { label: 'Like New', value: 'like_new' },
    { label: 'Good', value: 'good' },
    { label: 'Fair', value: 'fair' },
    { label: 'Poor', value: 'poor' }
  ];
  const types = ['Sell', 'Lend', 'Swap'];

  const handleChange = (e) => { const { name, value } = e.target; setFormData(p => ({ ...p, [name]: value })); if (errors[name]) setErrors(p => ({ ...p, [name]: '' })); };
  const handleImageChange = (e) => { const f = e.target.files[0]; if (f) { setImageFile(f); const r = new FileReader(); r.onloadend = () => setImagePreview(r.result); r.readAsDataURL(f); } };
  const removeImage = () => { setImageFile(null); setImagePreview(null); };

  const validateStep = (step) => {
    const e = {};
    if (step === 1) { 
      if (!formData.title.trim()) e.title = 'Required'; 
      if (!formData.author.trim()) e.author = 'Required'; 
      if (!formData.category) e.category = 'Required';
      if (formData.category === 'other' && !formData.newCategory.trim()) e.newCategory = 'Required';
    }
    if (step === 3 && formData.listing_type === 'sell' && (!formData.price || formData.price <= 0)) e.price = 'Required';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const nextStep = () => { if (validateStep(currentStep)) setCurrentStep(Math.min(3, currentStep + 1)); };
  const prevStep = () => setCurrentStep(Math.max(1, currentStep - 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    setIsSubmitting(true);
    setErrors({});
    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('author', formData.author);
      fd.append('condition', formData.condition);
      fd.append('listing_type', formData.listing_type);
      if (formData.listing_type === 'sell' && formData.price) fd.append('price', formData.price);
      if (formData.description) fd.append('description', formData.description);
      if (formData.category && formData.category !== 'other') {
        fd.append('category_id', formData.category);
      } else if (formData.category === 'other' && formData.newCategory) {
        fd.append('new_category', formData.newCategory);
      }
      if (formData.isbn) fd.append('isbn', formData.isbn);
      if (formData.city) fd.append('city', formData.city);
      if (formData.state) fd.append('state', formData.state);
      if (imageFile) fd.append('images', imageFile);

      await bookService.createBook(fd);
      setSuccessMessage(true);
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      console.error('Add book error:', err);
      const backendErrors = err?.response?.data?.errors;
      if (Array.isArray(backendErrors)) {
        const fieldErrors = {};
        backendErrors.forEach(e => { fieldErrors[e.field] = e.message; });
        setErrors(fieldErrors);
      } else {
        setErrors({ submit: err?.response?.data?.message || 'Failed to add book. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ background: '#FAF6EE', minHeight: '100vh' }}>
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417', fontWeight: '700' }}>Sign in to Add Books</h2>
          <p className="text-sm mb-6" style={{ color: '#8C7B6A' }}>Please log in to share your books.</p>
          <button onClick={() => navigate('/login')} className="btn-primary">Sign In</button>
        </div>
      </div>
    );
  }

  const steps = [{ n: 1, label: 'Book Info' }, { n: 2, label: 'Condition & Type' }, { n: 3, label: 'Photos & Price' }];
  const categoryList = categories.length > 0 ? categories : ['Fiction', 'Non-Fiction', 'Science & Technology', 'Biography', 'History', 'Mystery & Thriller', 'Romance', 'Self-Help', 'Education', 'Art & Design'];

  return (
    <div style={{ background: '#FAF6EE', minHeight: '100vh' }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417', fontWeight: '700' }}>Add a New Book</h1>
        <p className="text-sm mb-8" style={{ color: '#8C7B6A' }}>Share your book with the community</p>

        {/* Chapter Stepper */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: currentStep >= s.n ? '#7A4F1E' : 'transparent', color: currentStep >= s.n ? 'white' : '#B3A394', border: currentStep >= s.n ? 'none' : '1.5px solid #D5CBBD' }}>
                  {currentStep > s.n ? <Check className="h-4 w-4" /> : s.n}
                </div>
                <span className="text-sm font-medium hidden sm:inline" style={{ color: currentStep >= s.n ? '#2C2417' : '#B3A394' }}>Ch. {s.n} — {s.label}</span>
              </div>
              {i < steps.length - 1 && <div className="w-12 h-px" style={{ background: currentStep > s.n ? '#7A4F1E' : '#D5CBBD' }} />}
            </React.Fragment>
          ))}
        </div>

        {successMessage && (
          <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(42,107,92,0.08)', border: '1px solid rgba(42,107,92,0.15)', color: '#2A6B5C' }}>
            <p className="font-semibold text-sm">✓ Book added successfully! Redirecting...</p>
          </div>
        )}
        {errors.submit && (
          <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(196,75,43,0.08)', border: '1px solid rgba(196,75,43,0.15)', color: '#C44B2B' }}>
            <p className="font-semibold text-sm">{errors.submit}</p>
          </div>
        )}

        <div className="flex gap-8">
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="rounded-lg p-8" style={{ background: '#FFFCF5', border: '0.5px solid rgba(122,79,30,0.1)' }}>
              {currentStep === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#2C2417' }}>ISBN Lookup</label>
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#8C7B6A' }} />
                      <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} className="input-field pl-10" placeholder="Enter ISBN to auto-fill..." />
                    </div>
                    <p className="text-xs mt-1" style={{ color: '#B3A394' }}>Optional — auto-fills book details</p>
                  </div>
                  <div><label className="block text-sm font-semibold mb-2" style={{ color: '#2C2417' }}>Book Title *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="input-field" placeholder="Enter book title"
                      style={errors.title ? { borderColor: '#C44B2B' } : {}} />
                    {errors.title && <p className="text-xs mt-1" style={{ color: '#C44B2B' }}>{errors.title}</p>}</div>
                  <div><label className="block text-sm font-semibold mb-2" style={{ color: '#2C2417' }}>Author *</label>
                    <input type="text" name="author" value={formData.author} onChange={handleChange} className="input-field" placeholder="Author name"
                      style={errors.author ? { borderColor: '#C44B2B' } : {}} />
                    {errors.author && <p className="text-xs mt-1" style={{ color: '#C44B2B' }}>{errors.author}</p>}</div>
                  <div><label className="block text-sm font-semibold mb-2" style={{ color: '#2C2417' }}>Category *</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="input-field" style={errors.category ? { borderColor: '#C44B2B' } : {}}>
                      <option value="">Select category</option>
                      {categoryList.map((c, i) => {
                        const catName = typeof c === 'string' ? c : (c.category_name || c.name);
                        const catId = typeof c === 'string' ? c : (c.category_id || c.id || catName);
                        return <option key={catId || i} value={catId}>{catName}</option>;
                      })}
                      <option value="other">Other (Specify)</option>
                    </select>
                    {errors.category && <p className="text-xs mt-1" style={{ color: '#C44B2B' }}>{errors.category}</p>}
                  </div>

                  {formData.category === 'other' && (
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#2C2417' }}>Specify Category *</label>
                      <input type="text" name="newCategory" value={formData.newCategory} onChange={handleChange} className="input-field" placeholder="E.g. Poetry, Graphic Novel"
                        style={errors.newCategory ? { borderColor: '#C44B2B' } : {}} />
                      {errors.newCategory && <p className="text-xs mt-1" style={{ color: '#C44B2B' }}>{errors.newCategory}</p>}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#2C2417' }}>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="input-field resize-none" rows="3" placeholder="Describe the book..." />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#2C2417' }}>City</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} className="input-field" placeholder="e.g. Chennai" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#2C2417' }}>State</label>
                      <input type="text" name="state" value={formData.state} onChange={handleChange} className="input-field" placeholder="e.g. Tamil Nadu" />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-5">
                  <div><label className="block text-sm font-semibold mb-3" style={{ color: '#2C2417' }}>Condition *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {conditions.map(c => (
                        <button key={c.value} type="button" onClick={() => setFormData(p => ({ ...p, condition: c.value }))}
                          className="px-4 py-3 rounded-lg text-sm font-medium transition-all text-left"
                          style={{
                            background: formData.condition === c.value ? 'rgba(42,107,92,0.08)' : '#FFFCF5',
                            border: formData.condition === c.value ? '1.5px solid #2A6B5C' : '1px solid rgba(122,79,30,0.12)',
                            color: formData.condition === c.value ? '#2A6B5C' : '#8C7B6A',
                          }}>{c.label}</button>
                      ))}
                    </div>
                  </div>
                  <div><label className="block text-sm font-semibold mb-3" style={{ color: '#2C2417' }}>Type *</label>
                    <div className="grid grid-cols-3 gap-3">
                      {types.map(t => (
                        <button key={t} type="button" onClick={() => setFormData(p => ({ ...p, listing_type: t.toLowerCase() }))}
                          className="px-4 py-3 rounded-lg text-sm font-medium transition-all text-left"
                          style={{
                            background: formData.listing_type === t.toLowerCase() ? 'rgba(42,107,92,0.08)' : '#FFFCF5',
                            border: formData.listing_type === t.toLowerCase() ? '1.5px solid #2A6B5C' : '1px solid rgba(122,79,30,0.12)',
                            color: formData.listing_type === t.toLowerCase() ? '#2A6B5C' : '#8C7B6A',
                          }}>{t}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-5">
                  {formData.listing_type === 'sell' && (
                    <div><label className="block text-sm font-semibold mb-2" style={{ color: '#2C2417' }}>Price (₹) *</label>
                      <input type="number" name="price" value={formData.price} onChange={handleChange} className="input-field" placeholder="0.00" min="0"
                        style={{ ...(errors.price ? { borderColor: '#C44B2B' } : {}), fontFamily: "'JetBrains Mono', monospace" }} />
                      {errors.price && <p className="text-xs mt-1" style={{ color: '#C44B2B' }}>{errors.price}</p>}</div>
                  )}
                  <div><label className="block text-sm font-semibold mb-2" style={{ color: '#2C2417' }}>Book Photo</label>
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img src={imagePreview} alt="Preview" className="h-48 w-36 object-cover rounded-lg" style={{ border: '0.5px solid rgba(122,79,30,0.1)' }} />
                        <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-1 rounded-full" style={{ background: '#C44B2B', color: 'white' }}>
                          <X className="h-4 w-4" /></button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full px-6 py-10 rounded-lg cursor-pointer transition-all"
                        style={{ border: '2px dashed rgba(122,79,30,0.15)', background: 'rgba(122,79,30,0.02)' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor='#2A6B5C'} onMouseLeave={(e) => e.currentTarget.style.borderColor='rgba(122,79,30,0.15)'}>
                        <Upload className="h-8 w-8 mb-2" style={{ color: '#8C7B6A' }} />
                        <p className="text-sm font-medium" style={{ color: '#2C2417' }}>Click to upload or drag and drop</p>
                        <p className="text-xs mt-1" style={{ color: '#B3A394' }}>PNG, JPG up to 10MB</p>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-8 pt-6" style={{ borderTop: '0.5px solid rgba(122,79,30,0.08)' }}>
                {currentStep > 1 && (
                  <button type="button" onClick={prevStep} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    style={{ color: '#7A4F1E', border: '1px solid rgba(122,79,30,0.2)' }}>
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                )}
                {currentStep < 3 ? (
                  <button type="button" onClick={nextStep} className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
                    style={{ background: '#2A6B5C' }} onMouseEnter={(e) => e.currentTarget.style.background='#205549'} onMouseLeave={(e) => e.currentTarget.style.background='#2A6B5C'}>
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary disabled:opacity-50">
                    {isSubmitting ? 'Adding...' : 'Add Book'}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Live Preview */}
          <div className="hidden lg:block w-64">
            <div className="sticky top-20">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#B3A394' }}>Preview</p>
              <div className="rounded-lg overflow-hidden" style={{ background: '#FFFCF5', border: '0.5px solid rgba(122,79,30,0.1)', borderLeft: `4px solid ${formData.condition === 'excellent' ? '#2A7D4F' : formData.condition === 'good' ? '#B8860B' : formData.condition === 'fair' ? '#D97652' : '#C44B2B'}` }}>
                <div className="h-36" style={{ background: '#F5EFE3' }}>
                  {imagePreview && <img src={imagePreview} className="w-full h-full object-cover" />}
                </div>
                <div className="p-3">
                  <p className="text-sm font-bold line-clamp-1" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417' }}>{formData.title || 'Book Title'}</p>
                  <p className="text-xs" style={{ color: '#8C7B6A' }}>{formData.author || 'Author'}</p>
                  {formData.listing_type === 'sell' && formData.price && <p className="text-sm font-bold mt-2" style={{ color: '#7A4F1E', fontFamily: "'JetBrains Mono', monospace" }}>₹{formData.price}</p>}
                  {formData.listing_type === 'lend' && <p className="text-xs mt-2 font-medium" style={{ color: '#2A6B5C' }}>Available to Lend</p>}
                  {formData.listing_type === 'swap' && <p className="text-xs mt-2 font-medium" style={{ color: '#7A4F1E' }}>Available for Swap</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBookPage;
