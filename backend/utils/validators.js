import { body, validationResult } from 'express-validator';

/**
 * Validation rules for user registration
 */
export const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2-100 characters'),
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone format')
];

/**
 * Validation rules for user login
 */
export const validateLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required'),
  body('password')
    .notEmpty().withMessage('Password is required')
];

/**
 * Validation rules for adding a book
 */
export const validateBook = [
  body('title')
    .trim()
    .notEmpty().withMessage('Book title is required')
    .isLength({ min: 3, max: 255 }).withMessage('Title must be 3-255 characters'),
  body('author')
    .trim()
    .notEmpty().withMessage('Author is required')
    .isLength({ min: 2, max: 100 }).withMessage('Author must be 2-100 characters'),
  body('category_id')
    .optional()
    .isInt({ min: 1 }).withMessage('Valid category is required'),
  body('new_category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('New category must be 2-100 characters'),
  body().custom((value, { req }) => {
    if (!req.body.category_id && !req.body.new_category) {
      throw new Error('Either an existing category or a new category is required');
    }
    return true;
  }),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description max 1000 characters'),
  body('price')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Price must be a valid number'),
  body('condition')
    .isIn(['new', 'like_new', 'good', 'fair', 'poor'])
    .withMessage('Invalid condition value'),
  body('listing_type')
    .optional()
    .isIn(['sell', 'lend', 'swap'])
    .withMessage('Invalid listing type')
];

/**
 * Validation rules for creating a message
 */
export const validateMessage = [
  body('message_text')
    .trim()
    .notEmpty().withMessage('Message cannot be empty')
    .isLength({ max: 1000 }).withMessage('Message max 1000 characters')
];

/**
 * Validation rules for reviews
 */
export const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1-5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Comment max 500 characters')
];

/**
 * Validation rules for updating profile
 */
export const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Bio max 500 characters'),
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('City max 100 characters'),
  body('state')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('State max 100 characters')
];

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};
