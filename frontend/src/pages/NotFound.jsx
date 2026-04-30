import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#FAF6EE', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(122, 79, 30, 0.06)' }}>
            <BookOpen className="h-12 w-12" style={{ color: '#B3A394' }} />
          </div>
          <h1
            className="text-8xl font-bold mb-4"
            style={{ color: '#7A4F1E', fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            404
          </h1>
          <p className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417' }}>
            Page not found
          </p>
          <p className="mb-8" style={{ color: '#8C7B6A' }}>
            This chapter seems to be missing from our collection.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
