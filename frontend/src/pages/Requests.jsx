import React, { useState, useEffect } from 'react';
import { Inbox, ArrowRight, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import RequestCard from '../components/Shared/RequestCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';
import useAuth from '../hooks/useAuth';
import exchangeService from '../services/exchangeService';
import { useNavigate } from 'react-router-dom';

/**
 * Requests Page — real backend data
 */
const Requests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requests, setRequests] = useState({ incoming: [], sent: [], completed: [] });

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await exchangeService.getUserExchanges();
      const exchanges = response?.exchanges || response?.data || response || [];
      const list = Array.isArray(exchanges) ? exchanges : [];

      const userId = user?.id || user?.user_id;
      const incoming = list.filter(r => (r.seller_id === userId || r.owner_id === userId) && r.status !== 'completed' && r.status !== 'rejected');
      const sent = list.filter(r => (r.buyer_id === userId || r.requester_id === userId) && r.status !== 'completed');
      const completed = list.filter(r => r.status === 'completed');

      setRequests({ incoming, sent, completed });
    } catch (err) {
      console.error('Failed to load exchanges:', err);
      setError(err?.response?.data?.message || 'Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (exchangeId) => {
    try { await exchangeService.acceptExchange(exchangeId); loadRequests(); }
    catch (err) { console.error('Accept failed:', err); }
  };

  const handleReject = async (exchangeId) => {
    try { await exchangeService.rejectExchange(exchangeId); loadRequests(); }
    catch (err) { console.error('Reject failed:', err); }
  };

  const handleChat = (request) => {
    navigate('/chat');
  };

  const columnConfig = [
    { key: 'incoming', label: 'Incoming', icon: Inbox, color: '#B8860B', count: requests.incoming.length, userRole: 'owner' },
    { key: 'sent', label: 'Sent', icon: ArrowRight, color: '#2A6B5C', count: requests.sent.length, userRole: 'requester' },
    { key: 'completed', label: 'Completed', icon: CheckCircle2, color: '#7A4F1E', count: requests.completed.length, userRole: 'owner' },
  ];

  if (loading) return (<div style={{ background: '#FAF6EE', minHeight: '100vh' }}><Navbar /><LoadingSpinner message="Loading requests..." /></div>);

  return (
    <div style={{ background: '#FAF6EE', minHeight: '100vh' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl lg:text-4xl" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417', fontWeight: '700' }}>Requests</h1>
          <p className="text-sm mt-1" style={{ color: '#8C7B6A' }}>Manage your book exchange requests</p>
        </div>

        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

        <div className="hidden lg:grid grid-cols-3 gap-6">
          {columnConfig.map(col => {
            const Icon = col.icon;
            return (
              <div key={col.key}>
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="h-4 w-4" style={{ color: col.color }} />
                  <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#2C2417' }}>{col.label}</h2>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: col.color }}>{col.count}</span>
                </div>
                <div className="space-y-3 min-h-[200px]">
                  {requests[col.key].length > 0 ? (
                    requests[col.key].map(r => (
                      <RequestCard key={r.id || r.exchange_id} request={r} userRole={col.userRole}
                        onChat={() => handleChat(r)}
                        onAccept={() => handleAccept(r.id || r.exchange_id)}
                        onReject={() => handleReject(r.id || r.exchange_id)}
                        onMarkSent={() => {}} onConfirmReceipt={() => {}} />
                    ))
                  ) : (
                    <div className="text-center py-12 rounded-lg" style={{ background: 'rgba(122, 79, 30, 0.02)', border: '1px dashed rgba(122, 79, 30, 0.1)' }}>
                      <p className="text-sm" style={{ color: '#B3A394' }}>No {col.label.toLowerCase()} requests</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: Stacked */}
        <div className="lg:hidden space-y-8">
          {columnConfig.map(col => {
            const Icon = col.icon;
            return (
              <div key={col.key}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="h-4 w-4" style={{ color: col.color }} />
                  <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#2C2417' }}>{col.label}</h2>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: col.color }}>{col.count}</span>
                </div>
                <div className="space-y-3">
                  {requests[col.key].length > 0 ? (
                    requests[col.key].map(r => (
                      <RequestCard key={r.id || r.exchange_id} request={r} userRole={col.userRole}
                        onChat={() => handleChat(r)}
                        onAccept={() => handleAccept(r.id || r.exchange_id)}
                        onReject={() => handleReject(r.id || r.exchange_id)}
                        onMarkSent={() => {}} onConfirmReceipt={() => {}} />
                    ))
                  ) : <p className="text-sm py-4" style={{ color: '#B3A394' }}>No {col.label.toLowerCase()} requests</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Requests;
