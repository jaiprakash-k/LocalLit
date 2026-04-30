import React from 'react';
import { AlertCircle, X } from 'lucide-react';

/**
 * Error Message — Librarian Luxe
 */
const ErrorMessage = ({ message, onDismiss }) => {
  return (
    <div
      className="rounded-lg p-4 mb-6 flex items-center justify-between"
      style={{
        background: 'rgba(196, 75, 43, 0.06)',
        border: '1px solid rgba(196, 75, 43, 0.15)',
      }}
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5" style={{ color: '#C44B2B' }} />
        <p className="font-medium text-sm" style={{ color: '#C44B2B' }}>{message}</p>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="transition-colors" style={{ color: '#C44B2B' }}>
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
