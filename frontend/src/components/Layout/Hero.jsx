import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, MessageCircle } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="max-w-6xl mx-auto text-center space-y-8 animate-fadeIn">
        {/* Subtitle */}
        <div className="inline-block">
          <span className="px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium border border-emerald-500/30">
            Community Book Exchange Platform
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Share Stories,{' '}
          <span className="gradient-text">Build Community</span>
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Connect with readers worldwide. Exchange your favorite books, discover new stories, 
          and build lasting connections through the power of literature.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/register')}
            className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2"
          >
            <span>Get Started Free</span>
            <ArrowRight className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => navigate('/marketplace')}
            className="btn-secondary w-full sm:w-auto"
          >
            Browse Books
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="glass-card-light p-6 card-hover">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Vast Collection</h3>
            <p className="text-gray-400 text-sm">
              Access thousands of books from readers around the world
            </p>
          </div>

          <div className="glass-card-light p-6 card-hover">
            <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-teal-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Community Driven</h3>
            <p className="text-gray-400 text-sm">
              Connect with fellow booklovers and build your reading network
            </p>
          </div>

          <div className="glass-card-light p-6 card-hover">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Real-time Chat</h3>
            <p className="text-gray-400 text-sm">
              Instantly connect with sellers through our messaging system
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
