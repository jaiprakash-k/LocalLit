import React from 'react';

export const Card = ({ children, className = '' }) => (
  <div className={`glass-card p-6 ${className}`}>
    {children}
  </div>
);

export const Button = ({ children, variant = 'primary', size = 'md', ...props }) => {
  const baseClasses = 'font-semibold rounded-lg transition hover:shadow-lg';
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  const variantClasses = {
    primary: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600',
    secondary: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700'
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card max-w-md w-full p-6 mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 text-2xl transition-colors"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default { Card, Button, Modal };
