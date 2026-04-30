import { Order, Book, User } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Create an order
 */
export const createOrder = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { book_id } = req.body;

    // Get book
    const book = await Book.findByPk(book_id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Cannot order own book
    if (book.seller_id === userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot order your own book'
      });
    }

    // Create order
    const order = await Order.create({
      buyer_id: userId,
      seller_id: book.seller_id,
      book_id,
      order_status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get orders for current user
 */
export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { [Op.or]: [{ buyer_id: userId }, { seller_id: userId }] };
    if (status) whereClause.order_status = status;

    const { count, rows } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'buyer', attributes: ['user_id', 'name', 'email'] },
        { model: User, as: 'seller', attributes: ['user_id', 'name', 'email'] },
        { model: Book, as: 'book' }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['order_date', 'DESC']]
    });

    res.status(200).json({
      success: true,
      orders: rows,
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

/**
 * Update order status (seller only)
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;
    const { order_status } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Only seller can update status
    if (order.seller_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    await order.update({ order_status });

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get order by ID
 */
export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId, {
      include: [
        { model: User, as: 'buyer', attributes: ['user_id', 'name', 'email', 'phone'] },
        { model: User, as: 'seller', attributes: ['user_id', 'name', 'email', 'phone'] },
        { model: Book, as: 'book' }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};
