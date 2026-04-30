import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, AlertCircle, BookOpen } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Navbar from '../Layout/Navbar';

export const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await register(formData);
      if (result && result.token) {
        navigate('/browse');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMsg = err?.response?.data?.message || err?.message || 'Registration failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#FAF6EE', minHeight: '100vh' }}>
      <Navbar />

      <div className="flex min-h-[calc(100vh-56px)]">
        {/* Left Panel — Editorial */}
        <div
          className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center px-12 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #2A6B5C 0%, #205549 50%, #174038 100%)',
          }}
        >
          <div className="relative z-10 max-w-md">
            <BookOpen className="h-12 w-12 mb-8" style={{ color: '#6DBFAD' }} />
            <blockquote
              className="text-3xl lg:text-4xl leading-snug mb-6"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: '#D0EDE5',
                fontWeight: '600',
                fontStyle: 'italic',
              }}
            >
              "There is no friend as loyal as a book."
            </blockquote>
            <p className="text-base" style={{ color: 'rgba(208, 237, 229, 0.5)' }}>— Ernest Hemingway</p>
          </div>

          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full opacity-10" style={{ background: '#6DBFAD' }} />
          <div className="absolute top-20 -left-8 w-32 h-32 rounded-full opacity-5" style={{ background: '#D0EDE5' }} />
        </div>

        {/* Right Panel — Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1
                className="text-3xl mb-2"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: '#2C2417',
                  fontWeight: '700',
                }}
              >
                Create your account
              </h1>
              <p style={{ color: '#8C7B6A', fontSize: '15px' }}>Join our community of book lovers</p>
            </div>

            {error && (
              <div
                className="flex items-start gap-2 px-4 py-3 rounded-lg mb-6"
                style={{
                  background: 'rgba(196, 75, 43, 0.08)',
                  border: '1px solid rgba(196, 75, 43, 0.15)',
                  color: '#C44B2B',
                }}
              >
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Google Sign-in (UI only) */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium text-sm mb-6 transition-colors"
              style={{
                background: '#FFFCF5',
                border: '1px solid rgba(122, 79, 30, 0.15)',
                color: '#2C2417',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(122, 79, 30, 0.04)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFCF5'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px" style={{ background: 'rgba(122, 79, 30, 0.1)' }} />
              <span className="text-xs font-medium" style={{ color: '#B3A394' }}>or register with email</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(122, 79, 30, 0.1)' }} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#8C7B6A' }} />
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field pl-11" placeholder="Full Name" required />
              </div>

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#8C7B6A' }} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field pl-11" placeholder="your@email.com" required />
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#8C7B6A' }} />
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field pl-11" placeholder="••••••••" required />
              </div>

              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#8C7B6A' }} />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field pl-11" placeholder="Phone (Optional)" />
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center mt-6 text-sm" style={{ color: '#8C7B6A' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold transition-colors" style={{ color: '#2A6B5C' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
