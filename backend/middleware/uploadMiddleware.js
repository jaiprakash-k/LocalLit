import upload from '../config/multerConfig.js';

/**
 * Middleware for single file upload (profile image, book image)
 */
export const uploadSingleImage = upload.single('image');

/**
 * Middleware for multiple file upload (book gallery images)
 * Max 5 images per upload
 */
export const uploadMultipleImages = upload.array('images', 5);

/**
 * Error handler for file upload
 */
export const handleUploadError = (err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload failed'
    });
  }
  next();
};
