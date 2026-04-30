import React from 'react';

/**
 * PageWrapper - Main container for all pages with consistent styling
 */
export const PageWrapper = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 ${className}`}>
      {children}
    </div>
  );
};

/**
 * GlassCard - Reusable glass morphism card component
 */
export const GlassCard = ({ 
  children, 
  className = '', 
  darkGlass = false,
  interactive = false 
}) => {
  const baseClasses = darkGlass 
    ? 'bg-white/5 backdrop-blur-md border border-white/10 rounded-xl'
    : 'bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl';
  
  const interactiveClasses = interactive 
    ? 'transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 hover:bg-white/[0.15]'
    : '';

  return (
    <div className={`${baseClasses} ${interactiveClasses} ${className}`}>
      {children}
    </div>
  );
};

/**
 * PrimaryButton - Green gradient CTA button
 */
export const PrimaryButton = ({ 
  children, 
  onClick, 
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  fullWidth = false
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold px-8 py-3.5 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

/**
 * SecondaryButton - Glass effect button
 */
export const SecondaryButton = ({ 
  children, 
  onClick, 
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

/**
 * FormInput - Dark themed input with green focus ring
 */
export const FormInput = ({ 
  label, 
  type = 'text', 
  placeholder = '', 
  value, 
  onChange,
  required = false,
  icon: Icon = null,
  error = '',
  className = ''
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-gray-300 font-medium mb-2">
          {label}
          {required && <span className="text-emerald-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 px-4 py-3 ${Icon ? 'pl-10' : ''} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 backdrop-blur-sm transition-all duration-200 ${error ? 'focus:ring-red-500 border-red-500/50' : ''}`}
        />
      </div>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
};

/**
 * FormSelect - Dark themed select with green focus ring
 */
export const FormSelect = ({ 
  label, 
  value, 
  onChange,
  options = [],
  required = false,
  error = '',
  className = ''
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-gray-300 font-medium mb-2">
          {label}
          {required && <span className="text-emerald-400 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 backdrop-blur-sm transition-all duration-200 appearance-none cursor-pointer ${error ? 'focus:ring-red-500 border-red-500/50' : ''}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
};

/**
 * FormTextarea - Dark themed textarea with green focus ring
 */
export const FormTextarea = ({ 
  label, 
  placeholder = '', 
  value, 
  onChange,
  rows = 4,
  required = false,
  error = '',
  className = ''
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-gray-300 font-medium mb-2">
          {label}
          {required && <span className="text-emerald-400 ml-1">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={`w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 backdrop-blur-sm transition-all duration-200 resize-none ${error ? 'focus:ring-red-500 border-red-500/50' : ''}`}
      />
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
};

/**
 * ErrorAlert - Consistent error message display
 */
export const ErrorAlert = ({ message, icon: Icon = null }) => {
  return (
    <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl flex items-start space-x-2">
      {Icon && <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />}
      <span>{message}</span>
    </div>
  );
};

/**
 * SuccessAlert - Consistent success message display
 */
export const SuccessAlert = ({ message, icon: Icon = null }) => {
  return (
    <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl flex items-start space-x-2">
      {Icon && <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />}
      <span>{message}</span>
    </div>
  );
};

/**
 * LoadingSpinner - Consistent loading indicator
 */
export const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <GlassCard className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-gray-300">{message}</p>
      </GlassCard>
    </div>
  );
};

/**
 * SectionTitle - Consistent section titles
 */
export const SectionTitle = ({ children, subtitle = '' }) => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-white mb-2">{children}</h1>
      {subtitle && <p className="text-teal-200">{subtitle}</p>}
    </div>
  );
};

/**
 * FormGroup - Container for form inputs with consistent spacing
 */
export const FormGroup = ({ children, columns = 1, gap = 'gap-6' }) => {
  const gridClass = columns > 1 ? `grid grid-cols-1 md:grid-cols-${columns} ${gap}` : 'space-y-6';
  return <div className={gridClass}>{children}</div>;
};
