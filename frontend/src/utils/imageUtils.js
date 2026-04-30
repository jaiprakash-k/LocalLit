/**
 * Utility functions for handling images throughout the application
 */

// List of book-related image search terms for variety
const BOOK_SEARCH_TERMS = [
  'book',
  'reading',
  'library',
  'bookshelf',
  'novel',
  'education',
  'study',
];

/**
 * Get a random book-related image URL from Unsplash
 * @param {number} width - Image width in pixels (default: 300)
 * @param {number} height - Image height in pixels (default: 400)
 * @returns {string} - URL to a random book-related image
 */
export const getRandomBookImage = (width = 300, height = 400) => {
  const randomTerm = BOOK_SEARCH_TERMS[Math.floor(Math.random() * BOOK_SEARCH_TERMS.length)];
  const timestamp = Date.now(); // Add timestamp for cache busting
  return `https://source.unsplash.com/${width}x${height}/?${randomTerm}&t=${timestamp}`;
};

/**
 * Get a random profile/avatar image
 * @param {number} size - Avatar size in pixels (default: 150)
 * @returns {string} - URL to a random avatar image
 */
export const getRandomAvatarImage = (size = 150) => {
  const randomTerm = 'person,portrait,avatar';
  const timestamp = Date.now();
  return `https://source.unsplash.com/${size}x${size}/?${randomTerm}&t=${timestamp}`;
};

import { GET_BASE_URL } from '../services/api';

/**
 * Generate a book cover image URL with fallback
 * @param {string} existingUrl - Existing image URL to use if available
 * @param {number} width - Image width in pixels
 * @param {number} height - Image height in pixels
 * @returns {string} - URL to image
 */
export const getBookCoverUrl = (existingUrl, width = 300, height = 400) => {
  if (existingUrl && existingUrl.trim() && !existingUrl.includes('placeholder')) {
    if (existingUrl.startsWith('/uploads')) {
      return `${GET_BASE_URL()}${existingUrl}`;
    }
    return existingUrl;
  }
  return getRandomBookImage(width, height);
};

/**
 * Generate an avatar image URL with fallback
 * @param {string} existingUrl - Existing avatar URL to use if available
 * @param {number} size - Avatar size in pixels
 * @returns {string} - URL to avatar image
 */
export const getAvatarUrl = (existingUrl, size = 150) => {
  if (existingUrl && existingUrl.trim() && !existingUrl.includes('placeholder')) {
    if (existingUrl.startsWith('/uploads')) {
      return `${GET_BASE_URL()}${existingUrl}`;
    }
    return existingUrl;
  }
  return getRandomAvatarImage(size);
};

export default {
  getRandomBookImage,
  getRandomAvatarImage,
  getBookCoverUrl,
  getAvatarUrl,
};
