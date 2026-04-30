import { User, UserProfile, UserLocation, Review } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Get current user profile with profile data
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: UserProfile, as: 'UserProfile' },
        { model: UserLocation, as: 'UserLocation' }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID (public profile)
 */
export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: UserProfile, as: 'UserProfile' },
        { model: UserLocation, as: 'UserLocation' }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user reviews
    const reviews = await Review.findAll({
      where: { reviewed_user_id: userId },
      include: [{ model: User, as: 'reviewer', attributes: ['user_id', 'name'] }]
    });

    res.status(200).json({
      success: true,
      user: {
        ...user.toJSON(),
        reviews
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { name, bio, city, state } = req.body;

    // Update User table
    if (name) {
      await User.update({ name }, { where: { user_id: userId } });
    }

    // Update User_Profile table
    if (bio) {
      await UserProfile.update({ bio }, { where: { user_id: userId } });
    }

    // Update User_Location table
    if (city || state) {
      await UserLocation.update(
        { city: city || null, state: state || null },
        { where: { user_id: userId } }
      );
    }

    // Handle profile image upload
    if (req.file) {
      const profileImagePath = `/uploads/${req.file.filename}`;
      await UserProfile.update(
        { profile_image: profileImagePath },
        { where: { user_id: userId } }
      );
    }

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: UserProfile, as: 'UserProfile' },
        { model: UserLocation, as: 'UserLocation' }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload profile image
 */
export const uploadProfileImage = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const profileImagePath = `/uploads/${req.file.filename}`;
    await UserProfile.update(
      { profile_image: profileImagePath },
      { where: { user_id: userId } }
    );

    res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      imageUrl: profileImagePath
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user stats (books listed, orders, exchanges, etc.)
 */
export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Count books
    const bookCount = await Book.count({ where: { seller_id: userId } });

    // Count orders as buyer
    const buyerOrderCount = await Order.count({ where: { buyer_id: userId } });

    // Count orders as seller
    const sellerOrderCount = await Order.count({ where: { seller_id: userId } });

    // Count exchanges
    const exchangeCount = await Exchange.count({
      where: {
        [Op.or]: [
          { owner_id: userId },
          { requester_id: userId }
        ]
      }
    });

    res.status(200).json({
      success: true,
      stats: {
        booksListed: bookCount,
        buyerOrders: buyerOrderCount,
        sellerOrders: sellerOrderCount,
        exchanges: exchangeCount
      }
    });
  } catch (error) {
    next(error);
  }
};
