import { Review, User } from '../models/index.js';

/**
 * Create review
 */
export const createReview = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { reviewed_user_id, rating, comment } = req.body;

    // Cannot review yourself
    if (userId === parseInt(reviewed_user_id)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot review yourself'
      });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      where: { reviewer_id: userId, reviewed_user_id }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You already reviewed this user'
      });
    }

    // Create review
    const review = await Review.create({
      reviewer_id: userId,
      reviewed_user_id,
      rating,
      comment
    });

    // Update user average rating
    const reviews = await Review.findAll({
      where: { reviewed_user_id }
    });

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review,
      avgRating: avgRating.toFixed(2)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user reviews
 */
export const getUserReviews = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Review.findAndCountAll({
      where: { reviewed_user_id: userId },
      include: [
        { model: User, as: 'reviewer', attributes: ['user_id', 'name'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['review_date', 'DESC']]
    });

    res.status(200).json({
      success: true,
      reviews: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};
