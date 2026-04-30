/**
 * Currency Utilities
 * Handles INR currency formatting
 */

export const formatPrice = (price) => {
  if (!price && price !== 0) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(price);
};

export const formatPriceWithDecimals = (price) => {
  if (!price && price !== 0) return '₹0.00';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(price);
};
