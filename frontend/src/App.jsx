import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Landing from './pages/Landing';
import BrowseBooks from './pages/BrowseBooks';
import Explore from './pages/Explore';
import BookDetails from './pages/BookDetails';
import Wishlist from './pages/Wishlist';
import Requests from './pages/Requests';
import Ratings from './pages/Ratings';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import PublicProfile from './pages/PublicProfile';
import AddBookPage from './pages/AddBookPage';
import NotFound from './pages/NotFound';

// Auth Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Common Components
import ProtectedRoute from './components/Common/ProtectedRoute';

// Layout
import MobileBottomNav from './components/Layout/MobileBottomNav';

// Styles
import './styles/global.css';

/**
 * Main App Routes Component
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/browse" element={<BrowseBooks />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/book-details/:bookId" element={<BookDetails />} />
      <Route path="/user/:userId" element={<PublicProfile />} />

      {/* Protected Routes */}
      <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
      <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/add-book" element={<ProtectedRoute><AddBookPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/ratings" element={<ProtectedRoute><Ratings /></ProtectedRoute>} />

      {/* Legacy Routes */}
      <Route path="/marketplace" element={<Navigate to="/browse" replace />} />
      <Route path="/dashboard" element={<Navigate to="/browse" replace />} />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

/**
 * Main App Component — Librarian Luxe
 */
export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ChatProvider>
            <div className="min-h-screen pb-16 md:pb-0" style={{ background: '#FAF6EE' }}>
              <AppRoutes />
              <MobileBottomNav />
            </div>
          </ChatProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
