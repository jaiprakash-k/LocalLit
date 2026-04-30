import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import bookService from '../../services/bookService';
import { formatPrice } from '../../utils/currency';
import Navbar from '../Layout/Navbar';
import {
  PageWrapper,
  GlassCard,
  PrimaryButton,
  FormInput,
  FormSelect,
  FormTextarea,
  ErrorAlert,
  SectionTitle,
  FormGroup
} from './../../components/Common/ThemeComponents';

export const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category_id: '',
    description: '',
    price: '',
    condition: 'good'
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    loadCategories();
  }, [isAuthenticated, navigate]);

  const loadCategories = async () => {
    try {
      const response = await bookService.getCategories();
      setCategories(response.categories);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      await bookService.createBook(formDataToSend);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create book');
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    { value: '', label: 'Select Category' },
    ...categories.map(cat => ({
      value: cat.category_id,
      label: cat.category_name
    }))
  ];

  const conditionOptions = [
    { value: 'new', label: 'New' },
    { value: 'like_new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  return (
    <PageWrapper>
      <Navbar />
      <div className="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <GlassCard className="p-8 md:p-12">
            {/* Header */}
            <SectionTitle>Publish Your Book</SectionTitle>

            {/* Error Alert */}
            {error && (
              <div className="mb-6">
                <ErrorAlert message={error} />
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title and Author */}
              <FormGroup columns={2} gap="gap-6">
                <FormInput
                  label="Book Title"
                  type="text"
                  name="title"
                  placeholder="Enter book title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Author"
                  type="text"
                  placeholder="Enter author name"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              {/* Category and Condition */}
              <FormGroup columns={2} gap="gap-6">
                <FormSelect
                  label="Category"
                  value={formData.category_id}
                  onChange={handleChange}
                  options={categoryOptions}
                  required
                />
                <FormSelect
                  label="Condition"
                  value={formData.condition}
                  onChange={handleChange}
                  options={conditionOptions}
                />
              </FormGroup>

              {/* Price and Images */}
              <FormGroup columns={2} gap="gap-6">
                <FormInput
                  label="Price (₹)"
                  type="number"
                  placeholder="Enter price in INR"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Upload Images <span className="text-gray-500">(Max 5)</span>
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full bg-white/5 border-2 border-dashed border-emerald-500/30 text-gray-300 px-4 py-8 rounded-xl focus:outline-none focus:border-emerald-500 transition-all duration-200 cursor-pointer file:cursor-pointer file:bg-emerald-500/20 file:border-0 file:text-emerald-300 file:px-4 file:py-2 file:rounded file:mr-4"
                  />
                </div>
              </FormGroup>

              {/* Description */}
              <FormTextarea
                label="Description"
                placeholder="Describe the book condition, edition details, any notes, etc."
                value={formData.description}
                onChange={handleChange}
                rows={5}
              />

              {/* Image Preview */}
              {imagePreview.length > 0 && (
                <div>
                  <p className="text-gray-300 font-medium mb-4">
                    Selected images: <span className="text-emerald-400">{imagePreview.length}</span>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {imagePreview.map((preview, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-white/10"
                        />
                        <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-sm">{idx + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <PrimaryButton
                  type="submit"
                  loading={loading}
                  fullWidth
                >
                  {loading ? 'Publishing...' : 'Publish Book'}
                </PrimaryButton>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AddBook;
