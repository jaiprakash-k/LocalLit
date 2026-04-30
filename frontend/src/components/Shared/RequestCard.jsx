import React from 'react';
import { MessageSquare, CheckCircle, XCircle, Clock, Package, MapPin } from 'lucide-react';

/**
 * Request Card — Librarian Luxe
 * Warm surface card with inline actions and status badges
 */
const RequestCard = ({ request, userRole, onAccept, onReject, onMarkSent, onConfirmReceipt, onChat }) => {
  const statusStyles = {
    pending: { bg: 'rgba(184, 134, 11, 0.08)', color: '#B8860B', border: 'rgba(184, 134, 11, 0.15)', label: 'Pending' },
    accepted: { bg: 'rgba(42, 125, 79, 0.08)', color: '#2A7D4F', border: 'rgba(42, 125, 79, 0.15)', label: 'Accepted' },
    rejected: { bg: 'rgba(196, 75, 43, 0.08)', color: '#C44B2B', border: 'rgba(196, 75, 43, 0.15)', label: 'Declined' },
    sent: { bg: 'rgba(42, 107, 92, 0.08)', color: '#2A6B5C', border: 'rgba(42, 107, 92, 0.15)', label: 'Sent' },
    completed: { bg: 'rgba(122, 79, 30, 0.08)', color: '#7A4F1E', border: 'rgba(122, 79, 30, 0.15)', label: 'Completed' },
  };

  const status = statusStyles[request.status] || statusStyles.pending;

  return (
    <div className="rounded-lg p-5 transition-all"
      style={{
        background: '#FFFCF5',
        border: '0.5px solid rgba(122, 79, 30, 0.1)',
        boxShadow: '0 1px 3px rgba(122, 79, 30, 0.04)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(122, 79, 30, 0.08)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(122, 79, 30, 0.04)'}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-base font-bold" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2417' }}>
            {request.book_title}
          </h3>
          <p className="text-sm" style={{ color: '#8C7B6A' }}>by {request.book_author}</p>
        </div>
        <span className="px-2.5 py-1 rounded text-xs font-semibold"
          style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}>
          {status.label}
        </span>
      </div>

      <div className="mb-3 pb-3" style={{ borderBottom: '0.5px solid rgba(122, 79, 30, 0.06)' }}>
        <p className="text-sm" style={{ color: '#2C2417' }}>
          <span className="font-medium">{userRole === 'owner' ? 'From' : 'Owner'}:</span> {request.user_name}
        </p>
        {request.user_location && (
          <div className="flex items-center gap-1 mt-1" style={{ color: '#B3A394' }}>
            <MapPin className="h-3 w-3" /><span className="text-xs">{request.user_location}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs mb-3" style={{ color: '#B3A394' }}>
        <span>{request.request_type === 'lend' ? 'Lending' : 'Selling'}</span>
        {request.requested_date && <span>{new Date(request.requested_date).toLocaleDateString()}</span>}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={onChat} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white transition-colors"
          style={{ background: '#2A6B5C' }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#205549'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#2A6B5C'}>
          <MessageSquare className="h-3 w-3" /> Message
        </button>

        {userRole === 'owner' && request.status === 'pending' && (
          <>
            <button onClick={onAccept} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
              style={{ background: 'rgba(42, 125, 79, 0.08)', color: '#2A7D4F', border: '1px solid rgba(42, 125, 79, 0.15)' }}>
              <CheckCircle className="h-3 w-3" /> Accept
            </button>
            <button onClick={onReject} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
              style={{ background: 'rgba(196, 75, 43, 0.08)', color: '#C44B2B', border: '1px solid rgba(196, 75, 43, 0.15)' }}>
              <XCircle className="h-3 w-3" /> Decline
            </button>
          </>
        )}

        {userRole === 'owner' && request.status === 'accepted' && (
          <button onClick={onMarkSent} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            style={{ background: 'rgba(122, 79, 30, 0.08)', color: '#7A4F1E', border: '1px solid rgba(122, 79, 30, 0.15)' }}>
            <Package className="h-3 w-3" /> Mark Sent
          </button>
        )}

        {userRole === 'requester' && request.status === 'sent' && (
          <button onClick={onConfirmReceipt} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            style={{ background: 'rgba(42, 125, 79, 0.08)', color: '#2A7D4F', border: '1px solid rgba(42, 125, 79, 0.15)' }}>
            <CheckCircle className="h-3 w-3" /> Confirm Receipt
          </button>
        )}

        {request.status === 'pending' && (
          <div className="flex items-center gap-1 text-xs ml-auto" style={{ color: '#B3A394' }}>
            <Clock className="h-3 w-3" /> Awaiting response
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
