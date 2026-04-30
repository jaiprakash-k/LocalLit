import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, BookOpen } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Navbar from '../Layout/Navbar';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await login(email, password);
      if (result && result.token) {
        navigate('/browse');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err?.response?.data?.message || err?.message || 'Login failed';
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
            background: 'linear-gradient(135deg, #7A4F1E 0%, #5E3B14 50%, #462C0F 100%)',
          }}
        >
          <div className="relative z-10 max-w-md">
            <BookOpen className="h-12 w-12 mb-8" style={{ color: '#C4893A' }} />
            <blockquote
              className="text-3xl lg:text-4xl leading-snug mb-6"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: '#F8EBDA',
                fontWeight: '600',
                fontStyle: 'italic',
              }}
            >
              "A room without books is like a body without a soul."
            </blockquote>
            <p className="text-base" style={{ color: 'rgba(248, 235, 218, 0.5)' }}>— Marcus Tullius Cicero</p>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full opacity-10" style={{ background: '#C4893A' }} />
          <div className="absolute top-20 -left-8 w-32 h-32 rounded-full opacity-5" style={{ background: '#F8EBDA' }} />
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
                Welcome back
              </h1>
              <p style={{ color: '#8C7B6A', fontSize: '15px' }}>Sign in to continue to your account</p>
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

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px" style={{ background: 'rgba(122, 79, 30, 0.1)' }} />
              <span className="text-xs font-medium" style={{ color: '#B3A394' }}>or sign in with email</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(122, 79, 30, 0.1)' }} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email — Floating Label */}
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#8C7B6A' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#8C7B6A' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center mt-6 text-sm" style={{ color: '#8C7B6A' }}>
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold transition-colors" style={{ color: '#2A6B5C' }}>
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
