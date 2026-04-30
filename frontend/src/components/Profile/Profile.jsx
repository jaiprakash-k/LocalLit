import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import userService from '../../services/userService';
import Navbar from '../Layout/Navbar';
import { User, MapPin, Star, Camera, Edit2 } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getCurrentUser();
      setProfile(response.user);
      setStats({
        booksListed: 5,
        buyerOrders: 2,
        sellerOrders: 3,
        exchanges: 1
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
        <Navbar />
        <div className="pt-20 flex items-center justify-center h-screen">
          <div className="glass-card p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
      <Navbar />
      <div className="pt-20">
        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-b border-white/10"></div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Profile Card */}
          <div className="glass-card p-8 -mt-16 relative z-10 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 p-1">
                    <img
                      src={profile?.UserProfile?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.name}`}
                      alt={profile?.name}
                      className="w-full h-full rounded-full object-cover bg-slate-800"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-emerald-500 text-white p-3 rounded-full hover:bg-emerald-600 transition-colors duration-300 shadow-lg">
                    <Camera size={18} />
                  </button>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{profile?.name}</h1>
                    <p className="text-teal-200 mb-2">{profile?.email}</p>
                    
                    {profile?.UserLocation && (
                      <div className="flex items-center gap-2 text-gray-400 mb-4">
                        <MapPin size={16} />
                        <span>{profile.UserLocation.city}, {profile.UserLocation.state}</span>
                      </div>
                    )}

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-400">4.5 rating • 28 reviews</span>
                    </div>
                  </div>

                  <button className="btn-primary flex items-center gap-2">
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                </div>

                {profile?.UserProfile?.bio && (
                  <p className="text-gray-300">{profile.UserProfile.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="glass-card p-6 text-center hover:bg-white/[0.15] transition-all duration-300">
                <div className="text-3xl font-bold text-emerald-400 mb-2">{stats.booksListed}</div>
                <p className="text-gray-400">Books Listed</p>
              </div>
              <div className="glass-card p-6 text-center hover:bg-white/[0.15] transition-all duration-300">
                <div className="text-3xl font-bold text-teal-400 mb-2">{stats.buyerOrders}</div>
                <p className="text-gray-400">Purchases</p>
              </div>
              <div className="glass-card p-6 text-center hover:bg-white/[0.15] transition-all duration-300">
                <div className="text-3xl font-bold text-emerald-400 mb-2">{stats.sellerOrders}</div>
                <p className="text-gray-400">Sales</p>
              </div>
              <div className="glass-card p-6 text-center hover:bg-white/[0.15] transition-all duration-300">
                <div className="text-3xl font-bold text-orange-400 mb-2">{stats.exchanges}</div>
                <p className="text-gray-400">Exchanges</p>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="/dashboard" className="glass-card p-6 hover:bg-white/[0.15] transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-white mb-2">My Books</h3>
              <p className="text-gray-400">View and manage your listings</p>
            </a>

            <a href="/orders" className="glass-card p-6 hover:bg-white/[0.15] transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-white mb-2">Orders</h3>
              <p className="text-gray-400">Track your purchases and sales</p>
            </a>

            <a href="/chat" className="glass-card p-6 hover:bg-white/[0.15] transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-white mb-2">Messages</h3>
              <p className="text-gray-400">Chat with buyers and sellers</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
