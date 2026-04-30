import React from 'react';
import { Loader } from 'lucide-react';

/**
 * Loading Spinner — Librarian Luxe
 */
const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader className="h-8 w-8 animate-spin" style={{ color: '#7A4F1E' }} />
      <p className="text-sm font-medium mt-4" style={{ color: '#8C7B6A' }}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
